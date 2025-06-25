require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let adminToken;

describe("🏢 Создание организации (admin)", () => {
  beforeAll(async () => {
    const data = qs.stringify({
         grant_type: "password",
         phone_number: process.env.ADMIN_PHONE_NUMBER, 
         client_id: process.env.ADMIN_CLIENT_ID,
         code:   process.env.ADMIN_OTP_CODE
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
    adminToken = response.data.access_token;
  });

  it("🛠️ Должен создать новую организацию", async () => {
    const graphqlQuery = {
      query: `
        mutation {
          createOrganization(
            input: {
              nameKk: "Nessa"
              nameRu: "Nessa"
              nameEn: "Nessa"
              currency: "KZT"
              phoneNumber: "77054244323"
              email: "username@oyou.test"
              paymentSchemeVersion: 1
              status: ACTIVE
              aggregators: [
                {
                  aggregatorType: GLOVO
                  credentials: { apiKey: "mykeyNessa111" }
                }
              ]
              isEsfMember: true
            }
          ) {
            id
          }
        }
      `
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      graphqlQuery,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Логируем ответ сервера
    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    expect(response.status).toBe(200);
    expect(response.data.data.createOrganization).toHaveProperty("id");
  });
});
