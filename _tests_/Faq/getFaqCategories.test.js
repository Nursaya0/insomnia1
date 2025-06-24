require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📚 Получение категорий FAQ", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77071200998", // или process.env.USER_PHONE
      client_id: "mobile-frontend",
      code: "0998"                 // или process.env.OTP_CODE
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    expect(response.status).toBe(200);
    accessToken = response.data.access_token;
    console.log("✅ Токен успешно получен");
  });

  it("должен получить список категорий FAQ", async () => {
    const query = `
      query {
        faqCategories {
          name
          icon
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id": "14",      // или process.env.ORG_ID
          "X-Member-Id": "47716" // или process.env.MEMBER_ID
        }
      }
    );

    expect(res.status).toBe(200);
    const categories = res.data?.data?.faqCategories;
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);

    console.log("📚 Категории FAQ:");
    console.table(categories);
  });
});
