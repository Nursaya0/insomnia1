// api/ManagerToken.js
require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

/**
 * Получает токен менеджера по его phone_number + code + client_id
 */
async function getManagerTokenByOtp() {
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

  return response.data; // { access_token, refresh_token, ... }
}

module.exports = { getManagerTokenByOtp };
    