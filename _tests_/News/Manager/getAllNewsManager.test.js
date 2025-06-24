require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📰 Получение новостей (менеджер)", () => {
  let managerToken;

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
    managerToken = res.data.access_token;
    // console.log("✅ Менеджер токен получен");
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
      {
        query,
        variables: {} // Query Variables {}
      },
      {
        headers: {
          Authorization: `Bearer ${managerToken}`,
          "x-member-id": process.env.MEMBER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    const news = response.data?.data?.news;
    console.log("📦 Новости:");
    console.dir(news, { depth: null, colors: true });

    expect(news).toBeDefined();
    expect(Array.isArray(news.content)).toBe(true);
  });
});
