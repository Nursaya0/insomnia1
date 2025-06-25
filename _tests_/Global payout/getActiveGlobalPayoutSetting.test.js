require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

let accessToken;

describe('🔐 Авторизация администратора', () => {
  it('должен получить access_token', async () => {
    const payload = qs.stringify({
      grant_type: 'password',
      phone_number: process.env.ADMIN_PHONE_NUMBER,
      client_id: process.env.ADMIN_CLIENT_ID,
      code: process.env.ADMIN_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log('✅ Токен администратора получен');
  });
});

describe('🔎 Получение активных глобальных настроек выплат', () => {
  it('должен вернуть текущие настройки', async () => {
    const query = `
      query {
        activeGlobalPayoutSetting {
          id
          payout {
            maxDailyCount
            maxDailyAmount
            maxMonthlyAmount
            maxSingleAmount
            minSingleAmount
          }
          commission {
            absoluteBelowThreshold
            percentAboveThreshold
          }
          commissionThreshold
          status
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
    const setting = res.data.data.activeGlobalPayoutSetting;

    expect(setting).toHaveProperty('id');
    expect(setting).toHaveProperty('payout');
    expect(setting).toHaveProperty('commission');
    expect(setting).toHaveProperty('commissionThreshold');
    expect(setting).toHaveProperty('status');

    console.log('✅ Текущие глобальные настройки:', JSON.stringify(setting, null, 2));
  });
});
