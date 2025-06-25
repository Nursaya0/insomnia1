require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

let accessToken;

describe('🔄 Обновление роли в организации (менеджер)', () => {
  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log('✅ Менеджер авторизован');
  });

  it('должен обновить роль организации по ID', async () => {
    const query = `
      mutation ($id: Int!, $input: CreateOrgRoleInput!) {
        updateOrganizationRole(id: $id, input: $input) {
          id
        }
      }
    `;

    const variables = {
      id: 26,
      input: {
        name: "",
        description: "новое описаниее (до 5000 символов)"
      }
    };

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-ORG-ID': process.env.ORG_ID,
          'X-MEMBER-ID': process.env.MEMBER_ID,
        },
      }
    );

    expect(res.status).toBe(200);

    const updatedId = res.data.data?.updateOrganizationRole?.id;

    if (updatedId) {
      console.log(`🔄 Роль с ID ${updatedId} успешно обновлена`);
    } else {
      console.error('❌ Ошибка при обновлении роли:', JSON.stringify(res.data, null, 2));
    }
  });
});
