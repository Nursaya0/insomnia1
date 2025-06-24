
require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📱 Получение токена по OTP-коду", () => {
  it("должен вернуть access_token", async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77071200998",        
      client_id: "mobile-frontend",
      code: "0998"                       
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    // console.log("📦 Ответ от сервера:");
    // console.dir(response.data, { depth: null, colors: true });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("access_token");
    // console.log("✅ Токен успешно получен:", response.data.access_token);
  });
});
