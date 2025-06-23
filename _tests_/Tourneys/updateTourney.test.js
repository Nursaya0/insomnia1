require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("✏️ Обновление турнира", () => {
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

  it("должен обновить турнир с ID = 6", async () => {
    const mutation = `
      mutation {
        updateTourney(
          id: 6,
          input: {
            name: "T",
            startDate: "2025-11-10T00:00:00+06:00",
            endDate: "2025-11-17T00:00:00+06:00",
            aggregatorType: YANDEX, 
            organizationId: ${process.env.ORG_ID},
            rewards: [
              { place: 1, name: "FIRST", numberOfRewards: 1 },
              { place: 2, name: "SECOND", numberOfRewards: 2 }
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

    const updated = response.data?.data?.updateTourney;

    console.log("📝 Обновлён турнир:");
    console.dir(updated, { depth: null, colors: true });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(6);
  });
});
