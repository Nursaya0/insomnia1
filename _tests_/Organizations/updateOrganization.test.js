require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let adminToken;

describe("🏢 Обновление организации (admin)", () => {
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

  it("🛠️ Должен обновить организацию", async () => {
    const graphqlQuery = {
      query: `
        mutation {
          updateOrganization(
            id: 14
            input: {
              nameKk: "nameKk"
              nameRu: "nameRu"
              nameEn: "nameEn"
              corporateId: 1
              status: ACTIVE
              phoneNumber: "77971234568"
              email: "username@oyo.vv"
              aggregators: [
                {
                  aggregatorType: GLOVO
                  credentials: { apiKey: "myk3eyGLOVO2" }
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

    // Логируем ответ
    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    expect(response.status).toBe(200);
    expect(response.data.data.updateOrganization).toHaveProperty("id");
  });
});
