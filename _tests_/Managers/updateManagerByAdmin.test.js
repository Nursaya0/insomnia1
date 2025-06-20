
require("dotenv").config();
const axios = require("axios");
const { getAdminTokenByOtp } = require("../../api/AdminToken");

describe("✏️ Обновление менеджера (ID = 14) через администратора", () => {
  let token;

  const variables = {
    id: 14,
    firstName: "Asetova",
    lastName: "Asetov",
    middleName: "Asetovich",
    orgRoleId: 25
  };

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
    expect(token).toBeDefined();
    console.log("🔐 Админ токен получен");
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
          "Content-Type": "application/json"
          // ORG_ID и MEMBER_ID не нужны для админа
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const updatedId = response.data?.data?.updateManager?.id;

    expect(updatedId).toBe(variables.id);
    console.log(`✅ Менеджер с ID ${updatedId} успешно обновлён через администратора`);
  });
});
