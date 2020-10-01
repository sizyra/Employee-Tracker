const mysql = require("mysql");
const inquirer = require("inquirer");

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
                    add();
                    break;
                case "View departments, roles, or employees.":
                    view();
                    break;
                case "Update employee roles":
                    update();
                    break;
            };
        });
};

function add() {
    inquirer
        .prompt({
            name: "addWhat",
            type: "rawlist",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function(answer) {
            switch (answer.addWhat) {
                case "Department":
                    addDeptartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
            };
        });
};
