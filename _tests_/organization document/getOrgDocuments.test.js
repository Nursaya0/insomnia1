require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

let accessToken;

describe('📄 Получение организационных документов (менеджер)', () => {
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

  it('должен вернуть список документов по фильтру', async () => {
    const query = `
      query {
        orgDocuments(
          filter: { documentType: CONTRACT_OFFER, aggregatorType: YANDEX }
          page: 0
          size: 10
        ) {
          totalElements
          content {
            id
            createdAt
            author {
              id
              user {
                id
                phoneNumber
              }
            }
            aggregatorType
            documentType
            status
            fileName
            fileLink
          }
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-ORG-ID': process.env.ORG_ID,
          'X-MEMBER-ID': process.env.MEMBER_ID,
        },
      }
    );

    expect(response.status).toBe(200);
    const documents = response.data.data?.orgDocuments;

    if (documents) {
      console.log(`📄 Найдено документов: ${documents.totalElements}`);
    } else {
      console.error('❌ Ошибка при получении документов:', JSON.stringify(response.data, null, 2));
    }
  });
});
