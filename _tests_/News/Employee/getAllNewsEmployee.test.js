require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📰 Получение глобальных новостей (по OTP токену)", () => {
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
    // console.log("✅ Токен успешно получен");
  });

  it("должен получить список глобальных новостей и вывести подробно", async () => {
    const query = `
      query {
        news(page: 0, size: 10, global: true) {
          totalElements
          content {
            id
            title
            description
            content
            imageFileLink
          }
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

    const news = response.data?.data?.news;
    expect(news).toBeDefined();
    console.log(`📰 Получено ${news.totalElements} новостей`);

    // Выводим каждую новость полностью
    console.log("📋 Новости:");
    news.content.forEach((item, index) => {
      console.log(`\n🧾 Новость №${index + 1}:`);
      console.dir(item, { depth: null, colors: true });
    });
  });
});
