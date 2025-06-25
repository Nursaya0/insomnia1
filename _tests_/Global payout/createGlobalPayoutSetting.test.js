require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

let accessToken;

describe('💸 Админ: создание глобальных настроек выплат', () => {
  it('должен получить токен и создать настройки', async () => {
    // 🔐 Авторизация админа
    const data = qs.stringify({
      grant_type: 'password',
      phone_number: process.env.ADMIN_PHONE_NUMBER,
      client_id: process.env.ADMIN_CLIENT_ID,
      code: process.env.ADMIN_OTP_CODE,
    });

    const tokenRes = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    expect(tokenRes.status).toBe(200);
    accessToken = tokenRes.data.access_token;
    console.log('✅ Токен администратора получен');

    // 📤 Запрос на создание глобальных настроек выплат
    const query = `
      mutation {
        createGlobalPayoutSetting(
          input: {
            payout: {
              minSingleAmount: 1
              maxSingleAmount: 102
              maxDailyCount: 1
              maxDailyAmount: 20005
              maxMonthlyAmount: 300001
            }
            commission: {
              absoluteBelowThreshold: 0
              percentAboveThreshold: 0.3
            }
            commissionThreshold: 104
          }
        ) {
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
    const settingId = res.data.data?.createGlobalPayoutSetting?.id;
    if (settingId) {
      console.log('✅ Настройки успешно созданы. ID:', settingId);
    } else {
      console.error('❌ Ошибка создания настроек:', JSON.stringify(res.data, null, 2));
    }
  });
});
