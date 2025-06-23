require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📊 Менеджерская панель (Dashboard)", () => {
  let accessToken;

  beforeAll(async () => {
    const tokenPayload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      client_id: process.env.MANAGER_CLIENT_ID,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      tokenPayload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Менеджерский токен получен");
  });

  it("должен получить данные с панели менеджера", async () => {
    const query = `
      query {
        managerDashboard {
          employeeCount {
            activeTotal
            activeLastWeek
          }
          transactionsCount {
            successfulTotal
            successfulLastWeek
          }
          transactionsAmount {
            successfulTotal
            successfulLastWeek
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
          "x-member-id": process.env.MEMBER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    const dashboard = response.data?.data?.managerDashboard;
    expect(dashboard).toBeDefined();
    console.log("✅ Данные с менеджерской панели:");
    console.dir(dashboard, { depth: null, colors: true });
  });
});
