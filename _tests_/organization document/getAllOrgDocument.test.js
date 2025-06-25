require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let accessToken;

describe("📄 Получение списка документов организации (orgDocuments)", () => {
  // 🔐 Авторизация менеджера
  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
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
    console.log("✅ access_token получен");
  });

  it("должен вернуть список документов типа CONTRACT_OFFER агрегатора YANDEX", async () => {
    const query = `
      query {
        orgDocuments(
          filter: { documentType: CONTRACT_OFFER, aggregatorType: YANDEX }
          page: 0
          size: 10
        ) {
          totalElements
          content {
            id
            createdAt
            author {
              id
              user {
                id
                phoneNumber
              }
            }
            aggregatorType
            documentType
            status
            fileName
            fileLink
          }
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id": process.env.ORG_ID,
          "X-Member-Id": process.env.MEMBER_ID,
        },
      }
    );

    expect(res.status).toBe(200);
    const documents = res.data.data?.orgDocuments?.content || [];
    console.log("📄 Найдено документов:", documents.length);

    if (documents.length > 0) {
      console.log("🗂 Первый документ:", {
        id: documents[0].id,
        fileName: documents[0].fileName,
        status: documents[0].status,
      });
    }
  });
});
