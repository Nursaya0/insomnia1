// _tests_/getMemberBalance.test.js
require("dotenv").config();
const axios = require("axios");
const { getManagerTokenByOtp } = require("../api/ManagerToken");

describe("💰 Получение баланса организации по MEMBER_ID", () => {
  let token;

  beforeAll(async () => {
    const tokenResponse = await getManagerTokenByOtp();
    token = tokenResponse.access_token;
    console.log("🔑 Менеджер токен получен");
    expect(token).toBeDefined();
  });

  it("должен получить текущий баланс организации", async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            currentOrganizationBalance {
              balance
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-member-id": process.env.MEMBER_ID, // 🔥 вот эта строка важна!
        },
      }
    );

    console.log("📦 ПОЛНЫЙ ОТВЕТ ОТ СЕРВЕРА:");
    console.dir(response.data, { depth: null, colors: true });

    const balance = response.data?.data?.currentOrganizationBalance?.balance;

    expect(balance).toBeDefined();
    console.log(`✅ Баланс для организации: ${balance}`);
  });
});
