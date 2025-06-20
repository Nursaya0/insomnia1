
require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🔐 Получение токена по PIN (secure_key)", () => {
  it("должен вернуть access_token", async () => {
    const data = qs.stringify({
      grant_type: "password",
      client_id: "mobile-frontend",
      device_id: "123456",
      user_id: "testpartners",
      secure_key: "706172746e6572737061797365637572656b6579706172746e65727370617975", 
      scope: "openid email profile"
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
