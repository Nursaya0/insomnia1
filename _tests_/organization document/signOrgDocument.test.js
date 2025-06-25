require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("✍️ Подписание организационного документа", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77071200998",      // Тот самый номер
      client_id: "mobile-frontend",
      code: "0998"                      // OTP-код
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Access Token получен");
  });

  it("должен подписать документ с указанным documentId", async () => {
    const query = `
      mutation {
        signOrgDocument(documentId: 57) {
          signed
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id": "69114"
        }
      }
    );

    expect(response.status).toBe(200);
    const result = response.data.data?.signOrgDocument;

    if (result?.signed) {
      console.log("✅ Документ успешно подписан");
    } else {
      console.error("❌ Ошибка при подписании документа:", JSON.stringify(response.data, null, 2));
    }
  });
});
