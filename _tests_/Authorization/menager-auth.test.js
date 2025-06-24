require('dotenv').config();
const axios = require('axios');
const qs    = require('qs');

describe('Manager Authorization', () => {
  it('должен вернуть access_token при логине менеджера по OTP', async () => {
    const payload = qs.stringify({
      grant_type:   process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id:    process.env.MANAGER_CLIENT_ID,
      code:         process.env.MANAGER_OTP_CODE,
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log(response.status)
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access_token');
    expect(typeof response.data.access_token).toBe('string');
    expect(response.data.access_token.length).toBeGreaterThan(0);
  });
});
