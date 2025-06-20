test.skip('этот тест пропущен', () => {
  // он даже не запустится
  expect(true).toBe(false);
});


// require("dotenv").config();
// const axios = require("axios");
// const { getAdminTokenByOtp } = require("../api/AdminToken");

// describe("🆕 Создание нового менеджера через администратора", () => {
//   let token;

//   const variables = {
//     phoneNumber: "77054244322",
//     organizationId: 14,
//     firstName: "Nursaya",
//     lastName: "Nursaya",
//     middleName: "Nursaya",
//     orgRoleId: 25
//   };

//   beforeAll(async () => {
//     const tokenResponse = await getAdminTokenByOtp();
//     token = tokenResponse.access_token;
//     expect(token).toBeDefined();
//     console.log("🔐 Токен администратора получен");
//   });

//   it("должен успешно создать нового менеджера", async () => {
//     const response = await axios.post(
//       process.env.GRAPHQL_URL,
//       {
//         query: `
//           mutation CreateManager(
//             $phoneNumber: String!
//             $organizationId: Int!
//             $firstName: String
//             $lastName: String
//             $middleName: String
//             $orgRoleId: Int
//           ) {
//             createManager(
//               input: {
//                 phoneNumber: $phoneNumber
//                 organizationId: $organizationId
//                 firstName: $firstName
//                 lastName: $lastName
//                 middleName: $middleName
//                 orgRoleId: $orgRoleId
//               }
//             ) {
//               id
//             }
//           }
//         `,
//         variables
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("📦 Ответ от сервера:");
//     console.dir(response.data, { depth: null, colors: true });

//     const createdId = response.data?.data?.createManager?.id;

//     expect(createdId).toBeDefined();
//     console.log(`✅ Менеджер успешно создан с ID: ${createdId}`);
//   });
// });
