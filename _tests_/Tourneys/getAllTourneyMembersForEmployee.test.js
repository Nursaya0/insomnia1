require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let token;

describe("🏆 Получение участников турнира (OTP, x-member-id)", () => {
  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77474818132", // Заменить на нужный номер
      client_id: "mobile-frontend",
      code: "8132" // Заменить на актуальный OTP-код
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    expect(response.status).toBe(200);
    token = response.data.access_token;
  });

  it("📋 Должен получить список участников турнира", async () => {
    const graphqlQuery = {
      query: `
        query($tourneyId: Int!, $page: Int!, $size: Int!) {
          tourneyMembers(tourneyId: $tourneyId, page: $page, size: $size) {
            content {
              name
              numberOfOrders
              place
              reward
            }
            totalElements
          }
        }
      `,
      variables: {
        tourneyId: 123, // ❗ Замени на актуальный ID турнира
        page: 0,
        size: 10
      }
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      graphqlQuery,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-org-id": "55",
          "x-member-id": "69114"
        }
      }
    );

    // Логируем полный ответ
    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    expect(response.status).toBe(200);
    expect(response.data.data.tourneyMembers).toHaveProperty("content");
    expect(Array.isArray(response.data.data.tourneyMembers.content)).toBe(true);
  });
});
