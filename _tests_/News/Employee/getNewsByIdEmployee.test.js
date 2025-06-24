require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📰 Получение конкретной новости (newsItem) по OTP токену", () => {
  let accessToken;

  beforeAll(async () => {
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

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("access_token");
    accessToken = response.data.access_token;
    console.log("✅ Токен успешно получен");
  });

  it("должен получить новость по id=37", async () => {
    const query = `
      query {
        newsItem(id: 37) {
          id
          title
          description
          content
          imageFileLink
        }
      }
    `;

    const response = await axios.post(
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

    expect(response.status).toBe(200);
    const newsItem = response.data?.data?.newsItem;
    expect(newsItem).toBeDefined();

    console.log("\n🧾 Полученная новость:");
    console.dir(newsItem, { depth: null, colors: true });
  });
});
