const axios = require("axios");
const { getAdminTokenByOtp } = require("../api/AdminToken");
require("dotenv").config();

describe("🔁 Получение ID организации по имени и подробной информации", () => {
  let token;
  let organizationId;
  const orgNameToFind = "Choco Delivery";

  beforeAll(async () => {
    const tokenResponse = await getAdminTokenByOtp();
    token = tokenResponse.access_token;
    console.log("🔐 Админ токен успешно получен\n");
  });

  it("1️⃣ Поиск ID организации по названию", async () => {
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

    console.log(`✅ Организация найдена: \x1b[1m${found.name}\x1b[0m`);
    console.log(`🆔 ID организации: \x1b[36m${organizationId}\x1b[0m\n`);
  });

  it("2️⃣ Получение подробной информации об организации", async () => {
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
        variables: { id: parseInt(organizationId) },
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

    console.log("📦 Подробная информация:");
    console.log(`🔹 ID:           ${org.id}`);
    console.log(`🔹 Название:     ${org.name}`);
    console.log(`🔹 BIN:          ${org.identificationNumber}`);
    console.log(`🔹 Телефон:      ${org.phoneNumber}`);
    console.log(`🔹 Email:        ${org.email}`);
    console.log(`🔹 Статус:       ${org.status}`);
    console.log(`🔹 Город:        ${org.extCity}`);
    console.log(`🔹 Название (KK): ${org.nameKk}`);
    console.log(`🔹 Название (RU): ${org.nameRu}`);
    console.log(`🔹 Название (EN): ${org.nameEn}`);
    console.log(`🔹 Блокирована:  ${org.isBlocked ? "✅ Да" : "❌ Нет"}`);
    console.log(`🔹 Юр. лицо:     ${org.isLegalEntity ? "✅ Да" : "❌ Нет"}`);
    console.log(`🔹 Участник ЭСФ: ${org.isEsfMember ? "✅ Да" : "❌ Нет"}`);

    if (org.corporate) {
      console.log(`\n🏢 Корпоративная информация:`);
      console.log(`  🆔 ID:           ${org.corporate.id}`);
      console.log(`  🔸 Название:     ${org.corporate.name}`);
      console.log(`  🔸 RNN:          ${org.corporate.rnn}`);
      console.log(`  🔸 BIN:          ${org.corporate.identificationNumber}`);
      if (org.corporate.accounts?.length) {
        console.log(`  💳 Аккаунты:`);
        org.corporate.accounts.forEach(acc => {
          console.log(`    - 🆔 ${acc.id} | IBAN: ${acc.iban}`);
        });
      }
    }

    if (org.aggregators?.length) {
      console.log(`\n🔗 Агрегаторы:`);
      org.aggregators.forEach(agg => {
        console.log(`  • ID: ${agg.id} | Тип: ${agg.aggregatorType} | 🔐 Credentials: ${agg.credentials}`);
      });
    }

    if (org.parent) {
      console.log(`\n👪 Родительская организация:`);
      console.log(`  🆔 ID: ${org.parent.id} | Название: ${org.parent.name}`);
    }

    console.log("\n✅ Информация успешно выведена.");
  });
});
