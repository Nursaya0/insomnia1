require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let accessToken;

describe("🔐 Получение токена и создание заказа на карту сотрудника", () => {
  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77474818132",
      client_id: "mobile-frontend",
      code: "8132"
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
    accessToken = response.data.access_token;
  });

  it("🪪 Должен создать заказ на выпуск карты сотрудника", async () => {
    const graphqlQuery = {
      query: `
        mutation {
          createEmployeeCardOrder {
            orderId
            orderUrl
            returnUrl
            failUrl
          }
        }
      `
    };

    const response = await axios.post(
      `${process.env.GRAPHQL_URL}/graphql`,
      graphqlQuery,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": 55,
          "x-member-id": 69114
        }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.data.createEmployeeCardOrder).toHaveProperty("orderId");
    expect(response.data.data.createEmployeeCardOrder).toHaveProperty("orderUrl");
    expect(response.data.data.createEmployeeCardOrder).toHaveProperty("returnUrl");
    expect(response.data.data.createEmployeeCardOrder).toHaveProperty("failUrl");

    // Для отладки:
    // console.log("🎉 Ответ:", response.data.data.createEmployeeCardOrder);
  });
});
