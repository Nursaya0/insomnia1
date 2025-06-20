// test.skip("Пропущенный тест", () => {});


require("dotenv").config();
const axios = require("axios");
const qs = require("qs");
const chalk = require("chalk");

describe("Читабельный вывод данных сотрудника и его кошельков", () => {
  let accessToken;

  beforeAll(async () => {
    const payload = qs.stringify({
      grant_type: process.env.MANAGER_GRANT_TYPE,
      phone_number: process.env.MANAGER_PHONE_NUMBER,
      client_id: process.env.MANAGER_CLIENT_ID,
      code: process.env.MANAGER_OTP_CODE,
    });

    const response = await axios.post(
      `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
      payload,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = response.data.access_token;
  });

  it("должен красиво вывести информацию о кошельках сотрудника", async () => {
    const query = `
      query ($id: Int!) {
        employee(id: $id) {
          id
          firstName
          lastName
          wallet {
            id
            externalId
            balance
            currency
          }
          berekeWallet {
            id
            externalId
            balance
            currency
          }
          workWallet {
            id
            externalId
            balance
            currency
          }
        }
      }
    `;

    const variables = {
      id: parseInt(process.env.EMPLOYEE_ID),
    };

    const response = await axios.post(
      process.env.GRAPHQL_URL,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-org-id": process.env.ORG_ID,
          "x-member-id": process.env.MEMBER_ID,
        },
      }
    );

    const data = response.data.data.employee;

    // ✅ Красивый вывод
    console.log(chalk.bold("\n👤 Сотрудник:"));
    console.log(`${chalk.green("ID:")} ${data.id}`);
    console.log(`${chalk.green("Имя:")} ${data.firstName}`);
    console.log(`${chalk.green("Фамилия:")} ${data.lastName}`);

    const printWallet = (walletName, walletData) => {
      console.log(chalk.bold(`\n💼 ${walletName}:`));
      if (!walletData) {
        console.log(chalk.gray("  Нет данных"));
      } else {
        console.log(`  ${chalk.cyan("ID")}: ${walletData.id}`);
        console.log(`  ${chalk.cyan("External ID")}: ${walletData.externalId}`);
        console.log(`  ${chalk.cyan("Баланс")}: ${walletData.balance} ${walletData.currency}`);
      }
    };

    printWallet("Основной кошелёк", data.wallet);
    printWallet("Береке кошелёк", data.berekeWallet);
    printWallet("Рабочий кошелёк", data.workWallet);

    // ✅ Проверка
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
  });
});
