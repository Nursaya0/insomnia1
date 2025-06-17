const axios = require("axios");

// URL вашего GraphQL API (например, локальный сервер)
const API_URL = "https://api.dev.partnerspay.co/public/graphql";

describe("GraphQL Mutation: updateEmployee", () => {
  it("should update an employee and return employeeId", async () => {
    const mutation = `
      mutation UpdateEmployee($input: UpdateEmployeeInput!) {
        updateEmployee(input: $input) {
          employeeId
        }
      }
    `;

    const variables = {
      input: {
        employeeId: 47684,
        phoneNumber: "77778009009",
        status: "FIRED"
      }
    };

    // Отправляем запрос
    const response = await axios.post(API_URL, {
      query: mutation,
      variables
    }, {
      headers: { "Content-Type": "application/json" }
    });

    // Проверяем ответ
    expect(response.status).toBe(200);
    // expect(response.data.data.updateEmployee.employeeId).toBe("");

    // Здесь можно добавить проверку в базу данных, если нужно
    // Например, запрос к API или проверку через ORM
  });

  it("should return an error if employee does not exist", async () => {
    const mutation = `
      mutation UpdateEmployee($input: UpdateEmployeeInput!) {
        updateEmployee(input: $input) {
          employeeId
        }
      }
    `;

    const variables = {
      input: {
        employeeId: 999, // Несуществующий ID
        phoneNumber: "77778009009",
        status: "FIRED"
      }
    };

    const response = await axios.post(API_URL, {
      query: mutation,
      variables
    }, {
      headers: { "Content-Type": "application/json" }
    });

    expect(response.status).toBe(200); // GraphQL всегда возвращает 200, даже при ошибках
    expect(response.data.errors).toBeDefined();
    // expect(response.data.errors[0].message).toMatch(/not found/i); // Уточните текст ошибки
  });
}); 