require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🧑‍💼 Получение managerAggregators", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: process.env.MANAGER_PHONE_NUMBER, // например: "77001234567"
      client_id: process.env.MANAGER_CLIENT_ID,       // например: "mobile-frontend"
      code: process.env.MANAGER_OTP_CODE              // например: "1234"
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
    console.log("✅ Менеджер токен получен");
  });

  it("должен получить managerAggregators", async () => {
    const query = `
      query {
        managerAggregators {
          aggregator {
            name
            type
            icon {
              iconUrl
            }
          }
          managers {
            id
            user {
              id
              phoneNumber
            }
            organization {
              id
              name
            }
          }
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables: {} // Query Variables: {}
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data?.data?.managerAggregators;
    console.log("📦 Ответ managerAggregators:");
    console.dir(result, { depth: null, colors: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
