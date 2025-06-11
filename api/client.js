const axios = require("axios");
require("dotenv").config();

async function getTokenByOtp() {
  const baseURL = process.env.KEYCLOAK_URL;

  const data = new URLSearchParams({
    grant_type: "password",
    phone_number: process.env.PHONE_NUMBER,
    client_id: process.env.CLIENT_ID,
    code: process.env.OTP_CODE
  });

  const response = await axios.post(`${baseURL}/protocol/openid-connect/token`, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  return response.data;
}

module.exports = { getTokenByOtp };
