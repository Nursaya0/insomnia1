require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

describe("👤 Получение текущего сотрудника (currentEmployee)", () => {
  let accessToken;

  beforeAll(async () => {
    const data = qs.stringify({
      grant_type: "password",
      phone_number: "77474818132",
      client_id: "mobile-frontend",
      code: "8132"
    });

    const res = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    expect(res.status).toBe(200);
    accessToken = res.data.access_token;
    console.log("✅ Access Token получен");
  });

  it("должен вернуть информацию о текущем сотруднике", async () => {
    const query = `
      query {
        currentEmployee {
          id
          firstName
          lastName
          user {
            id
            phoneNumber
          }
          contractOffer {
            fileLink
            signed
            documentId
          }
        }
      }
    `;

    const res = await axios.post(
      process.env.GRAPHQL_URL,
      { query },
      {
         headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Org-Id": "55",    
          "X-Member-Id": "69114"  
        }
      }
    );

    expect(res.status).toBe(200);

    const employee = res.data.data?.currentEmployee;
    if (employee) {
      console.log("👤 Сотрудник:", employee.firstName, employee.lastName);
      console.log("📄 Документ подписан:", employee.contractOffer?.signed);
    } else {
      console.error("❌ Ошибка: сотрудник не найден", JSON.stringify(res.data, null, 2));
    }
  });
});
