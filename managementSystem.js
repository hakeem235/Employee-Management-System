const mysql = require("mysql");
const inquirer = require('inquirer');
require('console.table');

// create the connection information
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",

    // database
    database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) {
        console.log(err);
        mainMenu();
    }
});

function mainMenu() {
    // main menu prompts
    inquirer.prompt({
        type: "list",
        name: "startQ",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Departments",
            "View All Roles",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "Update Employee Role",
            "total Budget",
            "Exit",
        ]
    }).then(function (res) {
        switch (res.startQ) {
            case "View All Employees":
                viewAll();
                break;
            case "View All Departments":
                viewDept();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDept();
                break;
            case "Remove Employee":
                removeEmp();
                break;
            case "Remove Department":
                removeDept();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Update Employee Role":
                updateRole();
                break;
                case "total Budget":
                viewBudget();
                break;
            case "Exit":
                console.log('Goodbye!');
        }
    })
};
// function to view all Employee
const viewAll = () => {
    connection.query('SELECT employee.id,first_name, last_name, title,dept_name, salary FROM employee INNER JOIN roles ON employee.role_id=roles.id INNER JOIN department ON roles.dept_id = department.id;', (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log('-----------------------------------');
        mainMenu();
    });
};
// function to view all Departments
const viewDept = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log('-----------------------------------');
        mainMenu();
    });
};
// function to view all Roles
const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log('-----------------------------------');
        mainMenu();
    });
};
// function to add new Employee
const addEmp = () => {
    inquirer.prompt([{
            type: 'input',
            message: 'Please enter the first name?',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'Please enter the last name?',
            name: 'last_name',
        },
    ]).then((answer) => {
        let first_name = answer.first_name;
        let last_name = answer.last_name;
        let choiceRole = [];
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            results.forEach((role) => {
                choiceRole.push({
                    name: role.title,
                    value: role.id,
                })
            })
            inquirer.prompt([{
                    type: 'list',
                    name: 'role_id',
                    message: 'What is employee role?',
                    choices: choiceRole,

                }])
                .then((answer) => {
                    let role_id = answer.role_id;
                    let choiceManager = []
                    connection.query('SELECT employee.id,first_name, last_name, title,dept_name, salary FROM employee INNER JOIN roles ON employee.role_id=roles.id INNER JOIN department ON roles.dept_id=department.id;', (err, results) => {
                        if (err) throw err;
                        results.forEach((manager) => {
                            choiceManager.push({
                                name: manager.first_name + " " + manager.last_name,
                                value: manager.id
                            })
                        })
                        choiceManager.unshift({
                            name: 'None',
                            value: null,
                        })
                        inquirer.prompt([{
                            type: 'list',
                            name: 'manager_id',
                            message: 'Who is the manager?',
                            choices: choiceManager,
                        }]).then((answer) => {
                            let employee = {
                                manager_id: answer.manager_id,
                                role_id: role_id,
                                first_name: first_name,
                                last_name: last_name,
                            }
                            connection.query("INSERT INTO employee SET ?", employee,
                                (err) => {
                                    if (err) throw err;
                                    console.log('employee inserted!\n');
                                    // Call updateProduct AFTER the INSERT completes
                                    mainMenu()
                                }
                            );
                        });
                    })
                })
        })
    })
}

// function to add new Role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        let departmentArray = [];
        res.forEach(element => {
            departmentArray.push(element.dept_name);
        });
        inquirer.prompt([{
                type: 'list',
                name: 'department',
                message: 'Please choose the department',
                choices: departmentArray
            },
            {
                type: 'input',
                name: 'title',
                message: 'Please type the role you would like to add'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please provide the salary for the role'
            },

        ]).then((answer) => {
            let departmentId;
            res.forEach((element) => {
                if (answer.department === element.dept_name) {
                    departmentId = element.id
                };
            });
            connection.query('INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)',
                [answer.title, answer.salary, departmentId],
                (err) => {
                    if (err) throw err;
                    console.log("New role has been added\n")
                    mainMenu();
                })
        })
    });
}
// function to add new Department
const addDept = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'department_name',
        message: 'Please add new Department Name'
    }]).then((answer) => {
        connection.query(`INSERT INTO department (dept_name) VALUES (?)`, answer.department_name, (err) => {
            if (err) throw err;
            console.log("New Department has been added\n")
            mainMenu();
        })
    })
}

// function to delete Employee
const removeEmp = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: 'rawlist',
            name: 'employeeID',
            message: 'Please select an employee that will be fired?',
            choices: res.map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })
        }]).then(answer => {
            connection.query('DELETE FROM employee WHERE ?', [{
                id: answer.employeeID
            }], (err) => {
                if (err) throw err;
                console.log("the employee has been fired\n")
                mainMenu();
            })

        })
    })
}
// function to delete Department
const removeDept = () => {
    const remDep = 'SELECT * FROM department'
    connection.query(remDep, (err, res) => {
        if (err) throw err;
        inquirer.prompt([{
            type: 'list',
            name: 'dep_id',
            message: 'Please select a department you would like to delete from the list',
            choices: res.map(department => {
                return {
                    name: `${department.dept_name}`,
                    value: department.id
                }
            })
        }]).then(answer => {
            const remDep2 = `DELETE FROM department WHERE ?`
            connection.query(remDep2, [{
                id: answer.dep_id
            }], (err) => {
                if (err) throw err;
                console.log("Departmant has been deleted\n")
                mainMenu();
            })
        })
    })
}
// function to delete Role
const removeRole = () => {
    const remRole = 'SELECT * FROM roles'
    connection.query(remRole, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: 'list',
        name: 'role',
        message: 'Please select a  role you would like to delete from the list',
        choices: res.map(role => {
          return { name: `${role.title}`, value: role.id }
        })
      }]).then(answer => {
        const remRole2 = `DELETE FROM roles WHERE ?`
        connection.query(remRole2, [{ id: answer.role }], (err) => {
          if (err) throw err;
          console.log("Role has been deleted\n")
          mainMenu();
        })
      })
    })
}
// function to update Role
const updateRole = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', (err, res) => {
        if (err) throw err;

        const chooseEmp = res.map(item => ({
            name: `${item.first_name} ${item.last_name}`,
            value: item.id
        }))
        connection.query('SELECT roles.id, roles.title FROM roles', (err, response) => {

            const roles = response.map(item => ({
                "name": item.title,
                "value": item.id
            }));
            inquirer.prompt([{
                    type: 'list',
                    name: 'employee',
                    message: 'Please choose an employee?',
                    choices: chooseEmp
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Please choose new role',
                    choices: roles
                }
            ]).then((answer) => {
                connection.query('UPDATE employee SET employee.role_id = ? WHERE employee.id = ?', [answer.newRole, answer.employee], (err) => {
                    if (err) throw err;
                    console.log("Role has updated\n");
                    mainMenu()
                });

            });
        });

    });
};

const viewBudget = () => {
    connection.query(
    'SELECT roles.dept_id AS ID, department.dept_name AS Department, SUM(salary) AS Budget FROM roles INNER JOIN department ON roles.dept_id = department.id GROUP BY  roles.dept_id',
      (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log("\n")
        mainMenu();
      })
  }
// Welcome Message
function welcome() {
    console.log(` x-------------------------------------x`);
    console.log(` |                                     |`);
    console.log(`  Welcome to Ahmed's Management System  `);
    console.log(` |                                     |`);
    console.log(` x-------------------------------------x`);
    console.log(`                                        `);
};

// Start Program Function
function start() {
    // with welcome message
    welcome();
    // then firing main menu
    mainMenu();
}

// Starting Program
start();