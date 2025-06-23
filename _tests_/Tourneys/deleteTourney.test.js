require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🗑️ Удаление турнира", () => {
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

  it("должен удалить турнир с ID = 6", async () => {
    const query = `
      mutation {
        deleteTourney(id: 6) {
          id
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
        },
      }
    );

    const deleted = response.data?.data?.deleteTourney;

    console.log("🗑️ Удалён турнир:");
    console.dir(deleted, { depth: null, colors: true });

    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(6);
  });
});
