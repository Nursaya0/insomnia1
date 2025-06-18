// Имитация базы данных
const employeeDatabase = {};

const hireEmployee = async (adminToken, employeeId) => {
  // Реальная система: POST /api/employees/{id}/hire
  employeeDatabase[employeeId] = "active";
  return {
    success: true,
    employeeId,
    status: "active"
  };
};

const fireEmployee = async (adminToken, employeeId) => {
  // Реальная система: POST /api/employees/{id}/fire
  employeeDatabase[employeeId] = "fired";
  return {
    success: true,
    employeeId,
    status: "fired"
  };
};

const getEmployeeStatus = async (adminToken, employeeId) => {
  // Реальная система: GET /api/employees/{id}/status
  return employeeDatabase[employeeId] || "not_found";
};

module.exports = { hireEmployee, fireEmployee, getEmployeeStatus };