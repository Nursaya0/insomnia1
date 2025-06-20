// _tests_/getTransitAccountBalance.test.js
require("dotenv").config();
const axios = require("axios");
const { getAdminTokenByOtp } = require("../../api/AdminToken");

describe("💳 Получение баланса транзитного счёта", () => {
  let token;

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
    console.log("🔐 Токен администратора получен");
    expect(token).toBeDefined();
  });

  it("должен получить баланс транзитного счёта", async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            transitAccountBalance {
              balance
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const balance = response.data?.data?.transitAccountBalance?.balance;
    expect(balance).toBeDefined();

    console.log(`✅ Баланс транзитного счёта: ${balance}`);
  });
});
