const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rn80440330!",
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
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add departments, roles, or employees.",
                "Delete departments, roles, or employees.",
                "View departments, roles, or employees.",
                "Update employee roles."
            ]
        })
        .then(function(answerInit) {
            switch(answerInit.action) {
                case "Add departments, roles, or employees.":
                    addWhat();
                    break;
                case "Delete departments, roles, or employees.":
                    delWhat();
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
            type: "list",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "Return to last question."
            ]
        })
        .then(function(answerAW) {
            switch (answerAW.addWhat) {
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
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "What is the name of the department you would like to add?"
        })
        .then(function(answerDept) {
            let deptName = answerDept.departmentName
            let sql = `INSERT INTO department (name) VALUES ('${deptName}')`
            connection.query(sql, function (err, result) {
                if (err) throw err;
                return `Department named '${deptName}' added to the database.`
            });

            console.log(existingDepts);
            runApp();
        });
};

function addRole() {
    connection.query('SELECT * FROM department', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.name);
        console.log(options);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noDept",
                    type: "list",
                    message: "There must be a department to add a role to before creating a role. What would you like to do?",
                    choices: [
                        "Add a department.",
                        "Return to the beginning."
                    ]
                })
                .then(function(answers) {
                    switch(answers.noDept) {
                        case "Add a department.":
                            addDepartment();
                            break;
                        case "Return to the beginning.":
                            runApp();
                            break;
                    };
                });
        } else {
            inquirer
                .prompt([
                    {
                        name: "deptID",
                        type: "list",
                        message: "Which department will this role be in?",
                        choices: options
                    },
                    {
                        name: "roleTitle",
                        type: "input",
                        message: "What is the title of the role you would like to add?"
                    },
                    {
                        name: "roleSalary",
                        type: "input",
                        message: "What is the salary for this role? ($##,###)"
                    }
                ])
                .then(function(answers) {
                    const deptID = result[result.map(row => row.name).indexOf(answers.deptID)].id;
                    const title = answers.roleTitle;
                    const salary = answers.roleSalary;
                    connection.query(`INSERT INTO role (department_id, title, salary) VALUES (${title}, ${salary}, ${deptID})`, function(err, result) {
                        if (err) throw err;
                        return `Role titled '${title}' in department '${deptID}' with salary '${salary}' has been added to the database.`
                    })
                })
        };
    });
};

function addEmployee() {

}

function delWhat() {
    inquirer
        .prompt({
            name: "delwhat",
            type: "list",
            message: "What would you like to delete?",
            choices: [
                "Departments.",
                "Roles.",
                "Employees."
            ]
        })
        .then(function(answers) {
            switch(answers.delWhat){
                case "Departments.":
                    delDepartment();
                    break;
                case "Roles.":
                    delRole();
                    break;
                case "Employees.":
                    delEmployee();
            }
        })
}

function delDepartment() {
    inquirer

}