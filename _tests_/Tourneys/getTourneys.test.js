require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🏆 Получение списка турниров (tourneys)", () => {
  let accessToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: "password",
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Токен менеджера получен");
  });

  it("должен получить список турниров", async () => {
    const query = `
      query($page: Int!, $size: Int!) {
        tourneys(page: $page, size: $size) {
          content {
            id
            name
            organization {
              id
            }
            status
            startDate
            endDate
            aggregatorType
            rewards {
              place
              name
              numberOfRewards
            }
          }
          totalElements
        }
      }
    `;

    const variables = {
      page: 1,
      size: 20
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

    const tourneys = response.data?.data?.tourneys;

    console.log("📦 Турниры:");
    console.dir(tourneys, { depth: null, colors: true });

    expect(tourneys).toBeDefined();
    expect(Array.isArray(tourneys.content)).toBe(true);
  });
});
