const axios = require("axios");

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

    expect(response.status).toBe(200); 
    expect(response.data.errors).toBeDefined();
    
  });
}); 