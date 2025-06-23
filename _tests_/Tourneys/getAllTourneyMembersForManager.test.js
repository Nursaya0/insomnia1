require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🏆 Получение участников турнира (tourneyMembers)", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    expect(response.status).toBe(200);
    accessToken = response.data.access_token;
    console.log("✅ Менеджер токен получен");
  });

  it("должен получить участников турнира по tourneyId", async () => {
    const query = `
      query($tourneyId: Int!, $page: Int!, $size: Int!) {
        tourneyMembers(tourneyId: $tourneyId, page: $page, size: $size) {
          content {
            name
            phoneNumber
            numberOfOrders
            place
            reward
          }
          totalElements
        }
      }
    `;

    const variables = {
      tourneyId: 39,
      page: 0,
      size: 10
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID
        }
      }
    );

    const result = response.data?.data?.tourneyMembers;

    console.log("📦 Участники турнира:");
    console.dir(result, { depth: null, colors: true });

    expect(result).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
  });
});
