require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🖼️ Получение aggregatorIcons", () => {
  let accessToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: "password",
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    expect(response.status).toBe(200);
    accessToken = response.data.access_token;
    console.log("✅ Менеджер токен получен");
  });

  it("должен получить aggregatorIcons", async () => {
    const query = `
      query {
        aggregatorIcons {
          code
          iconUrl
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables: {}
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data?.data?.aggregatorIcons;

    console.log("📦 Результат aggregatorIcons:");
    console.dir(result, { depth: null, colors: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
