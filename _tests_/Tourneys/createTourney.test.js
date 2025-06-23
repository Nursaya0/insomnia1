require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🏆 Создание турнира", () => {
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
    console.log("✅ Менеджер токен получен");
  });

  it("должен создать турнир", async () => {
    const mutation = `
      mutation {
        createTourney(
          input: {
            name: "1 ",
            startDate: "2025-11-10T15:00:00+06:00",
            endDate: "2025-11-10T16:00:00+06:00",
            aggregatorType: YANDEX,
            organizationId: ${process.env.ORG_ID},
            rewards: [
              { place: 1, name: "First", numberOfRewards: 1 },
              { place: 2, name: "Second", numberOfRewards: 1 },
              { place: 3, name: "Third", numberOfRewards: 10 }
            ]
          }
        ) {
          id
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query: mutation },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID,
        },
      }
    );

    const tourney = response.data?.data?.createTourney;

    console.log("🎉 Турнир создан:");
    console.dir(tourney, { depth: null, colors: true });

    expect(tourney).toBeDefined();
    expect(tourney.id).toBeGreaterThan(0);
  });
});
