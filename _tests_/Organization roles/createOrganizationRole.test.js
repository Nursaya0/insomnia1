describe('🚫 Пропущенный тест', () => {
  test.skip('этот тест пропущен и ничего не делает', () => {
    // пусто
  });
});


// require("dotenv").config();
// const axios = require("axios");
// const qs = require("qs");

// describe("➕ Создание роли в организации менеджером", () => {
//   let accessToken;

//   beforeAll(async () => {
//     const payload = qs.stringify({
//       grant_type: process.env.MANAGER_GRANT_TYPE,
//       phone_number: process.env.MANAGER_PHONE_NUMBER,
//       client_id: process.env.MANAGER_CLIENT_ID,
//       code: process.env.MANAGER_OTP_CODE,
//     });

//     const res = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
//       payload,
//       { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//     );

//     expect(res.status).toBe(200);
//     accessToken = res.data.access_token;
//     console.log("✅ Менеджерский токен получен");
//   });

//   it('должен создать роль "админ"', async () => {
//     const mutation = `
//       mutation ($input: CreateOrgRoleInput!) {
//         createOrganizationRole(input: $input) {
//           id
//         }
//       }
//     `;

//     const variables = {
//       input: {
//         name: "админ",
//         description: "какое то описание (до 5000 символов)"
//       }
//     };

//     const response = await axios.post(
//       process.env.GRAPHQL_URL,
//       {
//         query: mutation,
//         variables,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "x-org-id": process.env.ORG_ID,
//           "x-member-id": process.env.MEMBER_ID,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("📦 Ответ:");
//     console.dir(response.data, { depth: null, colors: true });

//     const result = response.data?.data?.createOrganizationRole;
//     expect(result).toBeDefined();
//     expect(result.id).toBeDefined();
//     console.log("✅ Создана роль с ID:", result.id);
//   });
// });
