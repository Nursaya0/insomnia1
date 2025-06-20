
require('dotenv').config();

const axios = require('axios');
const qs    = require('qs');

describe('Keycloak token', () => {
  it('должен вернуть access_token', async () => {
    const payload = qs.stringify({
      grant_type:   process.env.KEYCLOAK_GRANT_TYPE,
      client_id:    process.env.KEYCLOAK_CLIENT_ID,
      username:     process.env.KEYCLOAK_USERNAME,
      password:     process.env.KEYCLOAK_PASSWORD,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('access_token');
  });
});
