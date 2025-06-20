
require("dotenv").config();
const axios = require("axios");
const { getManagerTokenByOtp } = require("../api/ManagerToken");

describe("📋 Получение менеджера по ID под токеном менеджера", () => {
  let token;

  beforeAll(async () => {
    const tokenResponse = await getManagerTokenByOtp();
    token = tokenResponse.access_token;
    expect(token).toBeDefined();
    console.log("🔐 Токен менеджера получен");
  });

  it("должен получить информацию по managerId = 89", async () => {
    const variables = { managerId: 89 };
    const orgId = process.env.ORG_ID;
    const memberId = process.env.MEMBER_ID;

    expect(orgId).toBeDefined();
    expect(memberId).toBeDefined();

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
          "Content-Type": "application/json",
          "x-org-id": orgId,
          "x-member-id": memberId
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
