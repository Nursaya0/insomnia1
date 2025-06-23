require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🧾 Получение ролей организации", () => {
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

  it('должен получить роли организации с поиском по слову "админ"', async () => {
    const query = `
      query {
        organizationRoles(
          search: "админ"
          page: 0
          size: 10
        ) {
          totalElements
          content {
            id
            name
            description
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

    const roles = response.data?.data?.organizationRoles;
    expect(roles).toBeDefined();
    console.log(`✅ Найдено ролей: ${roles.totalElements}`);
    console.dir(roles.content, { depth: null, colors: true });
  });
});
