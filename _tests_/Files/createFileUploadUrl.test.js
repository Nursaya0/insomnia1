//должен вернуть ссылку и fileId и не работает

require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📤 Мутация createFileUploadUrl с Query Variables", () => {
  let accessToken;

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
    accessToken = res.data.access_token;
    console.log("✅ Менеджерский токен получен");
  });

  it("должен вернуть ссылку и fileId", async () => {
    const query = `
      mutation CreateFileUploadUrl {
        createFileUploadUrl {
          url
          fileId
        }
      }
    `;

    const variables = {}; // пустые, как ты и просил

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📦 Ответ от сервера:");
    console.dir(response.data, { depth: null, colors: true });

    const result = response.data?.data?.createFileUploadUrl;
    expect(result).toBeDefined();
    expect(result.url).toMatch(/^https?:\/\//);
    expect(result.fileId).toBeDefined();

    console.log(`✅ Ссылка: ${result.url}`);
    console.log(`🆔 File ID: ${result.fileId}`);
  });
});
