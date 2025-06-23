require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🧑‍🤝‍🧑 Получение employeeAggregators", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77474818132",
      client_id: "mobile-frontend",
      code: "8132"
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

  it("должен получить employeeAggregators", async () => {
    const query = `
      query {
        employeeAggregators {
          aggregator {
            name
            type
            icon {
              iconUrl
            }
          }
          employees {
            id
            firstName
            lastName
            organization {
              id
              name
            }
            user {
              id
              phoneNumber
            }
            status
          }
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

    const result = response.data?.data?.employeeAggregators;
    console.log("📦 Ответ employeeAggregators:");
    console.dir(result, { depth: null, colors: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
