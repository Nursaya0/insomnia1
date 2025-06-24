// _tests_/news/getNewsItemByAdmin.test.js
jest.setTimeout(10_000);
require("dotenv").config();
const axios = require("axios");

// 🔐 Получение админ токена по OTP
async function getAdminTokenByOtpInline() {
  const data = new URLSearchParams({
    grant_type: "password",
    phone_number: process.env.ADMIN_PHONE_NUMBER,
    client_id: process.env.ADMIN_CLIENT_ID,
    code: process.env.ADMIN_OTP_CODE,
  });

  const resp = await axios.post(
    `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
    data.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return resp.data;
}

describe("📰 Получение новости по ID (newsItem) админом", () => {
  let adminToken;

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtpInline();
    adminToken = tokenResponse.access_token;
    expect(adminToken).toBeDefined();
    // console.log("✅ Админ токен получен");
  });

  it("должен вернуть новость по id=37", async () => {
    const query = `
      query {
        newsItem(id: 37) {
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

    const newsItem = response.data?.data?.newsItem;
    expect(newsItem).toBeDefined();
    console.log("✅ Получена новость:", newsItem.title);
    console.dir(newsItem, { depth: null, colors: true });
  });
});
