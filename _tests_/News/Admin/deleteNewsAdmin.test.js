jest.setTimeout(10000);
require("dotenv").config();
const axios = require("axios");

// Получение токена админа по OTP (встроено)
async function getAdminTokenByOtpInline() {
  const data = new URLSearchParams({
    grant_type: "password",
    phone_number: process.env.ADMIN_PHONE_NUMBER,
    client_id: process.env.ADMIN_CLIENT_ID,
    code: process.env.ADMIN_OTP_CODE,
  });

  const res = await axios.post(
    `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
    data.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}

describe("🗑️ Удаление новости админом", () => {
  let accessToken;

  beforeAll(async () => {
    accessToken = await getAdminTokenByOtpInline();
    expect(accessToken).toBeDefined();
    console.log("✅ Админ токен получен");
  });

  it("должен удалить новость с id=50", async () => {
    const mutation = `
      mutation {
        deleteNews(id: 50) {
          id
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query: mutation },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const deleted = res.data?.data?.deleteNews;
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(50);
    console.log(`✅ Новость с ID=${deleted.id} удалена`);
  });
});
