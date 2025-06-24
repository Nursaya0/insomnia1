jest.setTimeout(10_000);
require("dotenv").config();
const axios = require("axios");

async function getAdminTokenByOtpInline() {
  const baseURL = process.env.KEYCLOAK_URL;
  const data = new URLSearchParams({
    grant_type: "password",
    phone_number: process.env.ADMIN_PHONE_NUMBER,
    client_id: process.env.ADMIN_CLIENT_ID,
    code: process.env.ADMIN_OTP_CODE,
  });

  const resp = await axios.post(
    `${baseURL}/protocol/openid-connect/token`,
    data.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return resp.data;
}

describe("📰 Получение списка новостей как админ", () => {
  let adminToken;

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtpInline();
    adminToken = tokenResponse.access_token;
    expect(adminToken).toBeDefined();
    // console.log("✅ Админ токен получен");
  });

  it("должен получить список новостей", async () => {
    const query = `
      query {
        news(page: 0, size: 10) {
          totalElements
          content {
            id
            author {
              id
              user {
                id
                phoneNumber
              }
            }
            title
            description
            content
            startDate
            endDate
            active
            imageFileLink
          }
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const news = response.data?.data?.news;
    expect(news).toBeDefined();
    console.log(`✅ Найдено новостей: ${news.totalElements}`);
    console.dir(news.content, { depth: null, colors: true });
  });
});
