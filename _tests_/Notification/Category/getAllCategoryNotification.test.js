require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📬 Получение категорий уведомлений по secure_key", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      client_id: "mobile-frontend",
      device_id: "123456",
      user_id: "testpartners",
      secure_key: "706172746e6572737061797365637572656b6579706172746e65727370617975",
      scope: "openid email profile"
    });

    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    accessToken = tokenResponse.data.access_token;
    expect(accessToken).toBeDefined();
    console.log("✅ Токен по secure_key получен");
  });

  it("должен получить список категорий уведомлений", async () => {
    const graphqlQuery = {
      query: `
        query {
          notificationCategories {
            id
            code
            name
            lastNotificationDate
            newNotificationsCount
            name_ru
            name_en
            name_kk
          }
        }
      `
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      graphqlQuery,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const categories = response.data?.data?.notificationCategories;
    expect(categories).toBeDefined();
    categories.forEach((cat, i) => {
      console.log(`🔹 [${i + 1}] ${cat.name} (${cat.code})`);
      console.log(`    Новые: ${cat.newNotificationsCount} | Последнее: ${cat.lastNotificationDate}`);
    });

    console.log(`✅ Получено категорий: ${categories.length}`);
  });
});
