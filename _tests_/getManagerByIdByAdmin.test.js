// _tests_/getManagerByIdByAdmin.test.js
require("dotenv").config();
const axios = require("axios");
const { getAdminTokenByOtp } = require("../api/AdminToken");

describe("📋 Получение менеджера по ID через админ токен", () => {
  let token;

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
    expect(token).toBeDefined();
    console.log("🔐 Админ токен получен");
  });

  it("должен получить информацию по managerId = 89", async () => {
    const variables = { managerId: 89 };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query GetManagerById($managerId: Int!) {
            manager(id: $managerId) {
              id
              firstName
              lastName
              middleName
              user {
                id
                phoneNumber
              }
              organization {
                id
                name
              }
              orgRole {
                id
                name
              }
            }
          }
        `,
        variables
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const manager = response.data?.data?.manager;
    expect(manager).toBeDefined();
    console.log(`✅ Менеджер ID=${manager.id}: ${manager.firstName} ${manager.lastName}`);
  });
});
