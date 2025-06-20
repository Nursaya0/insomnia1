require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🏢 Получение списка корпоратов", () => {
  let accessToken;

  beforeAll(async () => {
    const tokenPayload = qs.stringify({
      grant_type: process.env.KEYCLOAK_GRANT_TYPE,
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      username: process.env.KEYCLOAK_USERNAME,
      password: process.env.KEYCLOAK_PASSWORD,
    });

    try {
      const tokenRes = await axios.post(
        `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
        tokenPayload,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      expect(tokenRes.status).toBe(200);
      accessToken = tokenRes.data.access_token;
      console.log("✅ Админ токен получен");
    } catch (error) {
      console.error("❌ Ошибка получения токена:", error.response?.data || error.message);
      throw error;
    }
  });

  it("должен получить список корпоратов", async () => {
    const query = `
      query {
        corporates(page: 0, size: 10) {
          content {
            id
            name
            identificationNumber
            accounts {
              id
              iban
            }
          }
          totalElements
        }
      }
    `;

    try {
      const res = await axios.post(
        process.env.GRAPHQL_URL,
        { query },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const corporates = res.data?.data?.corporates;
      expect(corporates).toBeDefined();
      console.log(`✅ Найдено ${corporates.totalElements} корпоративов:`);
      console.dir(corporates.content, { depth: null, colors: true });
    } catch (err) {
      console.error("❌ Ошибка при получении корпоративов:", err.response?.data || err.message);
      throw err;
    }
  });
});
