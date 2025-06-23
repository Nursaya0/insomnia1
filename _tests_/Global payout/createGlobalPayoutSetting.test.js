require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("💸 Создание глобальных настроек выплат", () => {
  let accessToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: process.env.KEYCLOAK_GRANT_TYPE,
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      username: process.env.KEYCLOAK_USERNAME,
      password: process.env.KEYCLOAK_PASSWORD,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Админ токен получен");
  });

  it("должен создать глобальные настройки выплат", async () => {
    const query = `
      mutation {
        createGlobalPayoutSetting(
          input: {
            payout: {
              minSingleAmount: 1
              maxSingleAmount: 102
              maxDailyCount: 1
              maxDailyAmount: 20005
              maxMonthlyAmount: 300001
            }
            commission: {
              absoluteBelowThreshold: 0
              percentAboveThreshold: 0.3
            }
            commissionThreshold: 104
          }
        ) {
          id
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables: {} // <---- добавлены Query Variables
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data?.data?.createGlobalPayoutSetting;

    console.log("📦 Ответ:");
    console.dir(result, { depth: null, colors: true });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
  });
});
