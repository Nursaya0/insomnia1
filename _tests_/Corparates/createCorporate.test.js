test.skip('этот тест пропущен', () => {
  // он даже не запустится
  expect(true).toBe(false);
});

// require("dotenv").config();
// const axios = require("axios");
// const qs = require("qs");

// describe("🏢 Создание корпоративной организации", () => {
//   let accessToken;

//   beforeAll(async () => {
//     try {
//       const tokenPayload = qs.stringify({
//         grant_type: process.env.KEYCLOAK_GRANT_TYPE,
//         client_id: process.env.KEYCLOAK_CLIENT_ID,
//         username: process.env.KEYCLOAK_USERNAME,
//         password: process.env.KEYCLOAK_PASSWORD,
//       });

//       const tokenRes = await axios.post(
//         `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
//         tokenPayload,
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//       );

//       expect(tokenRes.status).toBe(200);
//       accessToken = tokenRes.data.access_token;
//       console.log("✅ Админ токен получен");
//     } catch (error) {
//       console.error("❌ Ошибка при получении токена админа:", error.response?.data || error.message);
//       throw error;
//     }
//   });

//   it("должен создать корпоративную организацию", async () => {
//     const mutation = `
//       mutation CreateCorporate($input: CorporateInput!) {
//         createCorporate(input: $input) {
//           id
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         name: "name of corporate 77",
//         identificationNumber: "700300300319",
//         rnn: "700300300319",
//         account: {
//           iban: "KZ29NWBK601613211225"
//         }
//       }
//     };

//     try {
//       const response = await axios.post(
//         process.env.GRAPHQL_URL,
//         {
//           query: mutation,
//           variables
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const corporate = response.data?.data?.createCorporate;
//       expect(corporate).toBeDefined();
//       console.log(`✅ Корпоратив создан, ID: ${corporate.id}`);
//     } catch (err) {
//       console.error("❌ Ошибка при создании корпоратива:", err.response?.data || err.message);
//       throw err;
//     }
//   });
// });
