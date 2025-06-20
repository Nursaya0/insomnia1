
require("dotenv").config();
const axios = require("axios");
const { getManagerTokenByOtp } = require("../../api/ManagerToken");

describe("✏️ Обновление информации менеджера (ID = 14)", () => {
  let token;

  const variables = {
    id: 14,
    firstName: "Asetova",
    lastName: "Asetov",
    middleName: "Asetovich",
    orgRoleId: 25
  };

  beforeAll(async () => {
    const tokenResponse = await getManagerTokenByOtp();
    token = tokenResponse.access_token;
    expect(token).toBeDefined();
    console.log("🔐 Токен менеджера получен");
  });

  it(`должен обновить менеджера с ID = ${variables.id}`, async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          mutation UpdateManager(
            $firstName: String
            $lastName: String
            $middleName: String
            $orgRoleId: Int
            $id: Int!
          ) {
            updateManager(
              id: $id
              input: {
                firstName: $firstName
                lastName: $lastName
                middleName: $middleName
                orgRoleId: $orgRoleId
              }
            ) {
              id
            }
          }
        `,
        variables
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const updatedId = response.data?.data?.updateManager?.id;

    expect(updatedId).toBe(variables.id);
    console.log(`✅ Менеджер с ID ${updatedId} успешно обновлён`);
  });
});
