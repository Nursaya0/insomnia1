require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🏆 Получение турнира по ID", () => {
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
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Токен менеджера получен");
  });

  it("должен получить турнир по ID", async () => {
    const query = `
      query($id: Int!) {
        tourney(id: $id) {
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
      }
    `;

    const variables = { id: 1 };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID,
        },
      }
    );

    const tourney = response.data?.data?.tourney;

    console.log("📦 Турнир:");
    console.dir(tourney, { depth: null, colors: true });

    expect(tourney).toBeDefined();
    expect(tourney.id).toBe(1);
  });
});
