
require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("🗑 Удаление новости (deleteNews)", () => {
  let managerToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    expect(res.status).toBe(200);
    managerToken = res.data.access_token;
    // console.log("✅ Менеджерский токен получен");
  });

  it("должен удалить новость с ID=36", async () => {
    const mutation = `
      mutation {
        deleteNews(id: 36) {
          id
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: mutation,
        variables: {}
      },
      {
        headers: {
          Authorization: `Bearer ${managerToken}`,
          "x-member-id": process.env.MEMBER_ID,
          "x-org-id": process.env.ORG_ID,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const deletedNews = response.data?.data?.deleteNews;
    expect(deletedNews).toBeDefined();
    expect(deletedNews.id).toBe(36);
    console.log(`✅ Удалена новость с ID=${deletedNews.id}`);
  });
});
