const axios = require("axios");
const { getAdminTokenByOtp } = require("../api/AdminToken");
require("dotenv").config();

describe("🔁 Получение ID организации по имени и подробной информации", () => {
  let token;
  let organizationId;

  beforeAll(async () => {
    // 1. Получить токен
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
  });

  it("1️⃣ Получить ID организации по названию", async () => {
    const orgNameToFind = "Choco Delivery"; // нужное название

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query {
            organizations(page: 0, size: 150) {
              content {
                id
                name
              }
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const organizations = response.data.data.organizations.content;

    const found = organizations.find(org => org.name === orgNameToFind);
    expect(found).toBeDefined();

    organizationId = found.id;

    console.log(`✅ Найдена организация: "${found.name}"`);
    console.log(`🆔 Её ID: ${organizationId}`);
  });

  it("2️⃣ Получить подробную информацию по ID организации", async () => {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query: `
          query ($id: Int!) {
            organization(id: $id) {
              id
              name
              nameKk
              nameRu
              nameEn
              identificationNumber
              corporate {
                id
                name
                rnn
                identificationNumber
                accounts {
                  id
                  iban
                }
              }
              isBlocked
              isLegalEntity
              isEsfMember
              aggregators {
                id
                aggregatorType
                credentials
              }
              status
              phoneNumber
              parent {
                id
                name
              }
              email
              extCity
              extName
            }
          }
        `,
        variables: { id: parseInt(organizationId) }, // Убедись что ID — Int
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const org = response.data.data.organization;
    expect(org).toBeDefined();

    console.log("📦 Подробная информация об организации:");
    console.log(JSON.stringify(org, null, 2));
  });
});
