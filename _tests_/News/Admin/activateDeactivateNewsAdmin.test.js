jest.setTimeout(10000);
require("dotenv").config();
const axios = require("axios");

// Функция получения токена админа по OTP
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

describe("📰 Активация новости (updateNewsActive) админом", () => {
  let accessToken;

  beforeAll(async () => {
    accessToken = await getAdminTokenByOtpInline();
    expect(accessToken).toBeDefined();
    // console.log("✅ Админ токен получен");
    // console.log("📌 ORG_ID:", process.env.ORG_ID);
    // console.log("📌 MEMBER_ID:", process.env.MEMBER_ID);
  });

  it("должен активировать новость с id=50", async () => {
    const mutation = `
      mutation {
        updateNewsActive(id: 50, active: false)
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

    const result = res.data?.data?.updateNewsActive;
    expect(result).toBe(true);
    console.log("✅ Новость успешно активирована:", result);
  });
});
