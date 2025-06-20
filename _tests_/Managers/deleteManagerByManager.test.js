test.skip('этот тест пропущен', () => {
  // он даже не запустится
  expect(true).toBe(false);
});

// require("dotenv").config();
// const axios = require("axios");
// const { getManagerTokenByOtp } = require("../api/ManagerToken");

// describe("🗑️ Удаление менеджера ", () => {
//   let token;

//   beforeAll(async () => {
//     const tokenResponse = await getManagerTokenByOtp();
//     token = tokenResponse.access_token;
//     expect(token).toBeDefined();
//     console.log("🔐 Токен менеджера получен");
//   });

//   it("должен удалить менеджера с ID = 2", async () => {
//     const orgId = process.env.ORG_ID;
//     const memberId = process.env.MEMBER_ID;

//     expect(orgId).toBeDefined();
//     expect(memberId).toBeDefined();

//     const response = await axios.post(
//       process.env.GRAPHQL_URL,
//       {
//         query: `
//           mutation {
//             deleteManager(id: 2) {
//               id
//             }
//           }
//         `
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "x-org-id": orgId,
//           "x-member-id": memberId
//         }
//       }
//     );

//     console.log("📦 Ответ от сервера:");
//     console.dir(response.data, { depth: null, colors: true });

//     const deleted = response.data?.data?.deleteManager;

//     expect(deleted).toBeDefined();
//     console.log(`✅ Менеджер с ID=${deleted.id} успешно удалён`);
//   });
// });
