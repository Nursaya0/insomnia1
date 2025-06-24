require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("❓ Получение FAQ по ID", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77071200998", // или из .env
      client_id: "mobile-frontend",
      code: "0998" // OTP-код
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

  it("должен получить FAQ с ID = 7", async () => {
    const query = `
      query {
        faq(id: 7) {
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
          "X-Org-Id": "14",         
          "X-Member-Id": "47716"    
        }
      }
    );

    expect(res.status).toBe(200);
    const faq = res.data?.data?.faq;
    expect(faq).toBeDefined();
    console.log("📘 Получен FAQ:");
    console.dir(faq, { depth: null, colors: true });
  });
});
