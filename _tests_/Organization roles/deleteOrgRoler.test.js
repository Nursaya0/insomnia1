require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

let accessToken;

describe('🗑 Удаление роли в организации (менеджер)', () => {
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
    console.log('✅ Токен менеджера получен');
  });

  it('должен удалить роль в организации по ID', async () => {
    const query = `
      mutation {
        deleteOrganizationRole(id: 4) {
          id
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    expect(res.status).toBe(200);
    const deletedId = res.data.data?.deleteOrganizationRole?.id;

    if (deletedId) {
      console.log(`🗑 Роль с ID ${deletedId} успешно удалена`);
    } else {
      console.error('❌ Ошибка при удалении роли:', JSON.stringify(res.data, null, 2));
    }
  });
});
