require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("❓ Получение списка FAQ", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77071200998",      // или другой номер
      client_id: "mobile-frontend",
      code: "0998"                      // код OTP
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

    expect(response.status).toBe(200);
    accessToken = response.data.access_token;
    console.log("✅ Токен получен");
  });

  it("должен получить список FAQ", async () => {
    const query = `
      query {
        faqs {
          id
          question
          answer
          link
          published
          preview_photo
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
          "X-Org-Id": "14",         // или бери из process.env.ORG_ID
          "X-Member-Id": "47716"    // или из process.env.MEMBER_ID
        }
      }
    );

    expect(res.status).toBe(200);
    const faqs = res.data?.data?.faqs;
    expect(faqs).toBeDefined();
    console.log(`📚 Найдено ${faqs.length} FAQ:`);
    console.dir(faqs, { depth: null, colors: true });
  });
});
