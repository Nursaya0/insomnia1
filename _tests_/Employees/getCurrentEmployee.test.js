require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("👤 currentEmployee с балансами и орг.инфой", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77474818132",
      client_id: "mobile-frontend",
      code: "8132",
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Токен успешно получен");
  });

  it("должен вернуть данные currentEmployee", async () => {
    const query = `
      query {
        currentEmployee {
          id
          firstName
          lastSyncDate
          aggregatorType
          aggregatorBalance
          wallet {
            balance
          }
          berekeWallet {
            balance
          }
          workWallet {
            balance
          }
          organization {
            id
            name
            phoneNumber
            parent {
              name
              phoneNumber
            }
            isEsfMember
          }
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id":55,
          "X-Member-Id": 69114,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty("currentEmployee");
    console.log("👤 currentEmployee:", res.data.data.currentEmployee);
  });
});
