require("dotenv").config();
const axios = require("axios");

/**
 * Получает access_token и refresh_token по одноразовому коду (OTP).
 */
async function getTokenByOtp() {
  const baseURL = process.env.KEYCLOAK_URL;
  const data = new URLSearchParams({
    grant_type:   "password",
    phone_number: process.env.PHONE_NUMBER,
    client_id:    process.env.CLIENT_ID,
    code:         process.env.OTP_CODE
  });

  const response = await axios.post(
    `${baseURL}/protocol/openid-connect/token`,
    data,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return response.data;
}

/**
 * Обновляет (refresh) токен по уже полученному refresh_token.
 */
async function refreshToken(refreshTokenValue) {
  const baseURL = process.env.KEYCLOAK_URL;
  const data = new URLSearchParams({
    grant_type:    "refresh_token",
    client_id:     process.env.CLIENT_ID,
    refresh_token: refreshTokenValue
  });

  const response = await axios.post(
    `${baseURL}/protocol/openid-connect/token`,
    data,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return response.data;
}

module.exports = {
  getTokenByOtp,
  refreshToken
};
