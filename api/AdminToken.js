require("dotenv").config();
const axios = require("axios");

/**
 * Получает токен для админа по его phone_number + code + client_id
 */
async function getAdminTokenByOtp() {
  const baseURL = process.env.KEYCLOAK_URL;
  const data = new URLSearchParams({
    grant_type:   "password",
    phone_number: process.env.ADMIN_PHONE_NUMBER,
    client_id:    process.env.ADMIN_CLIENT_ID,
    code:         process.env.ADMIN_OTP_CODE
  });

  const resp = await axios.post(
    `${baseURL}/protocol/openid-connect/token`,
    data.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return resp.data;  // { access_token, refresh_token, expires_in, ... }
}

module.exports = { getAdminTokenByOtp };
