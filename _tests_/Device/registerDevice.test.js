require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("📲 Регистрация устройства по secure_key", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      client_id: "mobile-frontend",
      device_id: "123456",
      user_id: "testpartners",
      secure_key: "706172746e6572737061797365637572656b6579706172746e65727370617975",
      scope: "openid email profile"
    });

    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    accessToken = tokenResponse.data.access_token;
    expect(accessToken).toBeDefined();
    console.log("✅ Токен получен по secure_key");
  });

  it("должен зарегистрировать устройство", async () => {
    const graphqlMutation = {
      query: `
        mutation {
          registerDevice(input: { deviceId: "2", token: "again", language: "en" }) {
            id
          }
        }
      `
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      graphqlMutation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const device = response.data?.data?.registerDevice;
    expect(device).toBeDefined();

    console.log("📱 Устройство зарегистрировано:");
    console.log(`✅ ID: ${device.id}`);
  });
});
