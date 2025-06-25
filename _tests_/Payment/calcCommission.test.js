require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("💸 Расчет комиссии через calculateCommission", () => {
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
    console.log("✅ Access token получен");
  });

  it("должен вернуть расчет комиссии при amount = 10001", async () => {
    const query = `
      query CalcCommission($amount: Int!) {
        calculateCommission(amount: $amount) {
          commission
          formula
        }
      }
    `;

    const variables = {
      amount: 10001,
    };

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id": "55",
          "X-Member-Id": "69114",
        },
      }
    );

    expect(res.status).toBe(200);
    const commissionData = res.data.data?.calculateCommission;
    expect(commissionData).toHaveProperty("commission");
    expect(commissionData).toHaveProperty("formula");

    console.log("💰 Комиссия:", commissionData.commission);
    console.log("🧮 Формула:", commissionData.formula);
  });
});
