// employee-activate

require("dotenv").config();
const axios = require("axios");
const { getAdminTokenByOtp } = require("../api/AdminToken");

describe("Activate Employee as Admin", () => {
  let accessToken;

  beforeAll(async () => {
    const tokens = await getAdminTokenByOtp();
    accessToken = tokens.access_token;
  });

  it("должен изменить статус сотрудника на ACTIVE", async () => {
    const mutation = `
      mutation {
        updateEmployee(input: {
          employeeId: ${process.env.EMPLOYEE_ID},
          status: ACTIVE
        }) {
          employeeId
        }
      }
    `;

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query: mutation },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.data.updateEmployee.employeeId).toBe(
      parseInt(process.env.EMPLOYEE_ID)
    );
  });
});




//employee-fire
// require("dotenv").config();
// const axios = require("axios");
// const { getAdminTokenByOtp } = require("../api/AdminToken");

// describe("Fire Employee as Admin", () => {
//   let accessToken;

//   beforeAll(async () => {
//     const tokens = await getAdminTokenByOtp();
//     accessToken = tokens.access_token;
//   });

//   it("должен изменить статус сотрудника на FIRED", async () => {
//     const mutation = `
//       mutation {
//         updateEmployee(input: {
//           employeeId: ${process.env.EMPLOYEE_ID},
//           status: FIRED
//         }) {
//           employeeId
//         }
//       }
//     `;

//     const response = await axios.post(
//       process.env.GRAPHQL_URL,
//       { query: mutation },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     expect(response.status).toBe(200);
//     expect(response.data.data.updateEmployee.employeeId).toBe(
//       parseInt(process.env.EMPLOYEE_ID)
//     );
//   });
// });
