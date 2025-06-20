require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🔔 Получение уведомлений PAYMENTS по токену (secure_key)", () => {
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
    console.log("✅ Токен получен");
  });

  it("должен получить список уведомлений категории PAYMENTS", async () => {
    const graphqlQuery = {
      query: `
        query {
          notifications(page: 0, size: 1, search: { category: "PAYMENTS" }) {
            totalElements
            content {
              id
              createdAt
              category {
                code
                name
              }
              title
              message
              buttonTitle
              deeplink
            }
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

    const notifications = response.data?.data?.notifications;
    expect(notifications).toBeDefined();
    console.log("📦 Уведомления:");
    notifications.content.forEach((n, i) => {
      console.log(`🔹[${i + 1}] ${n.title}`);
      console.log(`    🕓 ${n.createdAt}`);
      console.log(`    📂 ${n.category.name} (${n.category.code})`);
      console.log(`    📄 ${n.message}`);
      if (n.buttonTitle || n.deeplink) {
        console.log(`    🔘 ${n.buttonTitle} → ${n.deeplink}`);
      }
    });
    console.log(`✅ Всего уведомлений: ${notifications.totalElements}`);
  });
});
