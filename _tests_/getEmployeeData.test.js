// test.skip("Пропущенный тест", () => {});



// /getEmployeeData.test.js
require('dotenv').config();
const axios = require('axios');
const { inspect } = require('util');

describe('Employee Data Output', () => {
  it('should fetch and display employee data', async () => {
    try {
      // 1. Проверка переменных окружения
      const requiredVars = [
        'KEYCLOAK_URL', 'MANAGER_GRANT_TYPE', 
        'MANAGER_PHONE_NUMBER', 'MANAGER_CLIENT_ID',
        'MANAGER_OTP_CODE', 'GRAPHQL_URL', 'EMPLOYEE_ID',
        'ORG_ID', 'MEMBER_ID' // Добавляем новые переменные
      ];
      
      requiredVars.forEach(varName => {
        if (!process.env[varName]) {
          throw new Error(`Переменная ${varName} не определена в .env`);
        }
      });

      // 2. Получаем токен
      console.log('\n🔐 Получаем access token...');
      const tokenResponse = await axios.post(
        `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: process.env.MANAGER_GRANT_TYPE,
          phone_number: process.env.MANAGER_PHONE_NUMBER,
          client_id: process.env.MANAGER_CLIENT_ID,
          code: process.env.MANAGER_OTP_CODE
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      console.log('✅ Токен получен');

      // 3. Запрашиваем данные сотрудника
      console.log('\n📡 Запрашиваем данные сотрудника...');
      const graphqlResponse = await axios.post(
        process.env.GRAPHQL_URL,
        {
          query: `
            query GetEmployee($id: Int!) {
              employee(id: $id) {
                id
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
                contractOffer {
                  fileLink
                  signed
                  documentId
                }
              }
            }
          `,
          variables: { 
            id: parseInt(process.env.EMPLOYEE_ID)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${tokenResponse.data.access_token}`,
            'Content-Type': 'application/json',
            'X-Org-id': process.env.ORG_ID,     // Новый заголовок
            'X-Member-id': process.env.MEMBER_ID // Новый заголовок
          }
        }
      );

      // 4. Проверяем ответ сервера
      if (!graphqlResponse.data?.data?.employee) {
        throw new Error('Сотрудник не найден или недостаточно прав');
      }

      // 5. Выводим результат
      const employee = graphqlResponse.data.data.employee;
      console.log('\n📋 Данные сотрудника:');
      console.log(inspect(employee, {
        colors: true,
        depth: null,
        compact: false
      }));

    } catch (error) {
      console.error('\n❌ Ошибка:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        if (error.response.data?.errors) {
          error.response.data.errors.forEach(err => {
            console.error('GraphQL Error:', err.message);
          });
        }
      } else {
        console.error(error.message);
      }
      throw error;
    }
  });
});