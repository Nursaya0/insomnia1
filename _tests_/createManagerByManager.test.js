test.skip('этот тест пропущен', () => {
  // он даже не запустится
  expect(true).toBe(false);
});


// require("dotenv").config();
// const axios = require("axios");
// const { getManagerTokenByOtp } = require("../api/ManagerToken");

// describe("🆕 Создание менеджера под токеном менеджера", () => {
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
//     const tokenResponse = await getManagerTokenByOtp();
//     token = tokenResponse.access_token;
//     expect(token).toBeDefined();
//     console.log("🔐 Токен менеджера получен");
//   });

//   it("должен создать нового менеджера", async () => {
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
//           "Content-Type": "application/json",
//           "x-org-id": process.env.ORG_ID,
//           "x-member-id": process.env.MEMBER_ID
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
