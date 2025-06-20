require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("👨‍💼 Получение сотрудников по менеджеру", () => {
  let managerToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      client_id: process.env.MANAGER_CLIENT_ID,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      code: process.env.MANAGER_OTP_CODE,
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    expect(response.status).toBe(200);
    managerToken = response.data.access_token;
    console.log("✅ Менеджер токен получен");
  });

  it("должен получить список сотрудников с пустым textSearch", async () => {
    const query = `
      query ($textSearch: String) {
        employees(
          page: 0
          size: 10
          search: {
            textSearch: $textSearch
            aggregatorType: CHOCO
            organizationId: ${process.env.ORG_ID}
          }) {
          totalElements
          content {
            id
            iin
            externalId
            firstName
            middleName
            lastName
            status
            aggregatorType
            user {
              id
              phoneNumber
            }
            organization {
              id
              name
            }
            transactionCount {
              total
            }
            wallet {
              id
            }
            workWallet {
              id
            }
          }
        }
      }
    `;

    const variables = { textSearch: "" };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${managerToken}`,
          "x-member-id": process.env.MEMBER_ID,
          "Content-Type": "application/json",
        },
      }
    );

    const employees = response.data?.data?.employees;
    expect(employees).toBeDefined();
    console.log(`✅ Найдено сотрудников: ${employees.totalElements}`);
    console.dir(employees.content, { depth: null, colors: true });
  });
});
