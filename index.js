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
                console.log(`Department named '${deptName}' added to the database.`);
            });

            console.log(existingDepts);
            runApp();
        });
};

function addRole() {
    connection.query('SELECT * FROM department', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.name);
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
                        message: "What is the salary for this role? Do not include anything but numbers."
                    }
                ])
                .then(function(answers) {
                    const deptID = result[result.map(row => row.name).indexOf(answers.deptID)].id;
                    const title = answers.roleTitle;
                    const salary = answers.roleSalary;
                    const sql = "INSERT INTO role (department_id, title, salary) VALUES (?, ?, ?)"
                    const params = [deptID, title, salary]
                    connection.query(sql, params, function(err, result) {
                        if (err) throw err;
                        console.log(`Role titled '${title}' in department '${deptID}' with salary '${salary}' has been added to the database.`);
                    })
                    runApp();
                })
        };
    });
};

function addEmployee() {
    connection.query('SELECT * FROM role', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.name);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noRole",
                    type: "list",
                    message: "There must be a role to add an employee to before adding an employee. What would you like to do?",
                    choices: [
                        "Add a role.",
                        "Return to the beginning."
                    ]
                })
                .then(function(answers) {
                    switch(answers.noRole) {
                        case "Add a role.":
                            addRole();
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
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's first name?"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's last name?"
                    },
                    {
                        name: "roleID",
                        type: "list",
                        message: "What is the employee's role?",
                        choices: options
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Does this employee have a manager?",
                        choices: [
                            "Yes.",
                            "No."
                        ]
                    }
                ]).then(function(answers) {
                    if (answers.manager === "Yes.") {
                        inquirer
                            .prompt([
                                
                            ])
                    }
                })
        }
    });
}

function delWhat() {
    inquirer
        .prompt({
            name: "delWhat",
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
    connection.query('SELECT * FROM department', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.name);
        console.log(options);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noDeptDel",
                    type: "list",
                    message: "There are no departments to delete. What would you like to do?",
                    choices: [
                        "Add a department.",
                        "Return to the beginning."
                    ]
                }).then(function(answers) {
                    switch(answers.noDeptDel) {
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
                .prompt({
                    name: "deleteDept",
                    type: "rawlist",
                    message: "Which department would you like to delete?",
                    choices: options
                }).then(function(answers) {
                    const delDept = answers.deleteDept
                    const sql = `DELETE FROM department WHERE name = '${delDept}'`
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(`Department '${delDept}' has been deleted.`)
                        runApp();
                    });
                });
        };
    });
};

function delRole() {
    connection.query('SELECT * FROM role', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.title);
        console.log(options);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noRoleDel",
                    type: "list",
                    message: "There are no roles to delete. What would you like to do?",
                    choices: [
                        "Add a role.",
                        "Return to the beginning."
                    ]
                }).then(function(answers) {
                    switch(answers.noRoleDel) {
                        case "Add a role.":
                            addRole();
                            break;
                        case "Return to the beginning.":
                            runApp();
                            break;
                    };
                });
        } else {
            inquirer
                .prompt({
                    name: "deleteRole",
                    type: "rawlist",
                    message: "Which role would you like to delete?",
                    choices: options
                }).then(function(answers) {
                    const delRole = answers.deleteRole
                    const sql = `DELETE FROM role WHERE title = '${delRole}'`
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(`Role '${delRole}' has been deleted.`)
                        runApp();
                    });
                });
        };
    });
}

function delEmployee() {
    connection.query('SELECT * FROM employee', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.last_name);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noEmployeeDel",
                    type: "list",
                    message: "There are no employees to delete. What would you like to do?",
                    choices: [
                        "Add an employee.",
                        "Return to the beginning."
                    ]
                }).then(function(answers) {
                    switch(answers.noEmployeeDel) {
                        case "Add a employee.":
                            addEmployee();
                            break;
                        case "Return to the beginning.":
                            runApp();
                            break;
                    };
                });
        } else {
            inquirer
                .prompt({
                    name: "deleteEmployee",
                    type: "rawlist",
                    message: "Which employee would you like to delete?",
                    choices: options
                }).then(function(answers) {
                    const delEmployee = answers.deleteEmployee
                    const sql = `DELETE FROM employee WHERE title = '${delEmployee}'`
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(`Employee '${delEmployee}' has been deleted.`)
                        runApp();
                    });
                });
        };
    });
}

function viewWhat() {
    inquirer
        .prompt({
            name: "viewWhat",
            type: "list",
            message: "Which table would you like to view?",
            choices: [
                "Departments.",
                "Roles.",
                "Employees."
            ]
        })
        .then(function(answers) {
            switch(answers.viewWhat){
                case "Departments.":
                    viewDepartment();
                    break;
                case "Roles.":
                    viewRole();
                    break;
                case "Employees.":
                    viewEmployee();
            }
        })
}

function viewDepartment() {
    connection.query('SELECT * FROM Department', function (err, result) {
        if (err) throw err;
        const options = result.map(row => row.last_name);
        if (options.length < 1) {
            inquirer
                .prompt({
                    name: "noDeptView",
                    type: "list",
                    message: "There are no departments to view. What would you like to do?",
                    choices: [
                        "Add a department.",
                        "Return to the beginning."
                    ]
                }).then(function(answers) {
                    switch(answers.noDeptView) {
                        case "Add a department.":
                            addDepartment();
                            break;
                        case "Return to the beginning.":
                            runApp();
                            break;
                    };
                });
        }
    })
}