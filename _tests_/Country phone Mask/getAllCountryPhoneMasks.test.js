
require("dotenv").config();
const axios = require("axios");

describe("🌍 Получение списка масок телефонов по странам", () => {
  it("должен вернуть список стран с телефонными масками", async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            countryPhoneMasks {
              id
              name
              iconUrl
              mask
              name_ru
              name_kk
              name_en
            }
          }
        `
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const masks = response.data?.data?.countryPhoneMasks;

    expect(Array.isArray(masks)).toBe(true);
    expect(masks.length).toBeGreaterThan(0);
    console.log(`✅ Получено масок: ${masks.length}`);
  });
});
