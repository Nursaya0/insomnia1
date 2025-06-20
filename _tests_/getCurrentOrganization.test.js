// organizatoin/Get current organization (Manager)
require("dotenv").config();
const axios = require("axios");
const { getManagerTokenByOtp } = require("../api/ManagerToken");

describe("🏢 Получение информации об организации (currentOrganization)", () => {
  let token;

  beforeAll(async () => {
    const tokenResponse = await getManagerTokenByOtp();
    token = tokenResponse.access_token;
    console.log("🔐 Токен менеджера получен");
    expect(token).toBeDefined();
  });

  it("должен вернуть текущую организацию", async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            currentOrganization {
              id
              name
              corporate {
                id
                name
              }
              aggregators {
                id
                aggregatorType
                credentials
              }
              isEsfMember
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-member-id": process.env.MEMBER_ID,
          "x-org-id": process.env.ORG_ID,
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const org = response.data?.data?.currentOrganization;

    expect(org).toBeDefined();
    expect(org.id).toBeDefined();
    expect(org.name).toBeDefined();
    expect(org.corporate).toBeDefined();

    console.log(`✅ Организация: ${org.name} (ID: ${org.id})`);
  });
});
