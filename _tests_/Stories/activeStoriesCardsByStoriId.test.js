require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🖼️ Получение storyCards", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      client_id: "mobile-frontend",
      device_id: "123456",
      user_id: "testpartners",
      secure_key: "706172746e6572737061797365637572656b6579706172746e65727370617975",
      scope: "openid email profile"
    });

    try {
      const response = await axios.post(
        `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
        data,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      expect(response.status).toBe(200);
      accessToken = response.data.access_token;
      // console.log("✅ Токен получен");
    } catch (err) {
      console.error("❌ Ошибка получения токена:", err.response?.data || err.message);
      throw err;
    }
  });

  it("должен получить активные storyCards для story_id = 1", async () => {
    const query = `
      query {
        storyCards(
          where: {
            story_id: { _eq: 1 },
            is_active: { _eq: true }
          },
          order_by: { order: asc_nulls_first }
        ) {
          image_url
          text
          text_position
          text_align
          order
        }
      }
    `;

    try {
      const response = await axios.post(
        process.env.GRAPHQL_URL,
        { query },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      const cards = response.data?.data?.storyCards;
      expect(cards).toBeDefined();
      console.log(`✅ Получено карточек: ${cards.length}`);
      console.dir(cards, { depth: null, colors: true });
    } catch (err) {
      console.error("❌ Ошибка при получении storyCards:", err.response?.data || err.message);
      throw err;
    }
  });
});
