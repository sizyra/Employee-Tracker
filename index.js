const mysql = require("mysql");
const inquirer = require("inquirer");
const Role = require("./exports/Role");
const Employee = require("./exports/Employee");
const Department = require("./exports/Department");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "RN80440330!",
    database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add departments, roles, or employees.",
                "View departments, roles, or employees.",
                "Update employee roles"
            ]
        })
        .then(function(answer) {
            switch(answer.action) {
                case "Add departments, roles, or employees.":
                    addWhat();
                    break;
                case "View departments, roles, or employees.":
                    viewWhat();
                    break;
                case "Update employee roles":
                    updateWhat();
                    break;
            };
        });
};

function addWhat() {
    inquirer
        .prompt({
            name: "addWhat",
            type: "rawlist",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "Return to last question."
            ]
        })
        .then(function(answer) {
            switch (answer.addWhat) {
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
                case "Return to last question.":
                    runApp();
                    break;
            };
        });
};

function addDepartment() {

}