require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

describe('💳 Заказ карты сотрудника', () => {
  let accessToken;

  beforeAll(async () => {
    try {
      const payload = qs.stringify({
        grant_type: process.env.KEYCLOAK_GRANT_TYPE,
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        username: process.env.KEYCLOAK_USERNAME,
        password: process.env.KEYCLOAK_PASSWORD,
      });

      const res = await axios.post(
        `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
        payload,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      expect(res.status).toBe(200);
      accessToken = res.data.access_token;
      console.log('✅ Токен получен');
    } catch (err) {
      console.error('❌ Ошибка при получении токена:', err.response?.data || err.message);
      throw err;
    }
  });

  it('должен заказать карту по orderId', async () => {
    const payload = {
      orderId: "orderIdFromCardBinding"
    };

    try {
      const response = await axios.post(
        `${process.env.OPEN_API_URL}/payment/api/v1/employee-cards/order`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      expect(response.status).toBe(200);
      console.log('📦 Ответ от сервера:');
      console.dir(response.data, { depth: null, colors: true });
    } catch (err) {
      console.error('❌ Ошибка при заказе карты:', err.response?.data || err.message);
      throw err;
    }
  });
});
