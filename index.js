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
        
  }