require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🧑‍💼 Получение списка менеджеров (токен менеджера)", () => {
  let accessToken;

  beforeAll(async () => {
    const tokenData = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      client_id: process.env.MANAGER_CLIENT_ID,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      tokenData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Менеджер токен получен");
  });

  it("должен получить список менеджеров", async () => {
    const query = `
      query {
        managers(page: 0, size: 20) {
          totalElements
          content {
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

    const managers = response.data?.data?.managers;
    expect(managers).toBeDefined();
    console.log(`✅ Найдено менеджеров: ${managers.totalElements}`);
    console.dir(managers.content, { depth: null, colors: true });
  });
});
