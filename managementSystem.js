const mysql = require("mysql");
const inquirer = require('inquirer');
const Choices = require("inquirer/lib/objects/choices");
const Choice = require("inquirer/lib/objects/choice");
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
// function to view all Employee
const viewAll = () => {
    connection.query('SELECT employee.id,first_name, last_name, title,dept_name, salary FROM employee INNER JOIN roles ON employee.role_id=roles.id INNER JOIN department ON roles.dept_id=department.id;', (err, res) => {
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
                                    viewAll()
                                    mainMenu();
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
    const choiceDept = [];
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        results.forEach((dept) => {
            choiceDept.push({
                name: dept.dept_name,
                value: dept.id
            })
        });

    })
    inquirer.prompt([{
            type: 'input',
            message: 'What is the new role?',
            name: 'title',
        },
        {
            type: 'input',
            message: 'The Basic salary?',
            name: 'salary',
        },
        {
            type: 'list',
            message: 'what is the department ',
            name: 'dept_id',
            choices: choiceDept,
        }

    ]).then((answer) => {
            connection.query("INSERT INTO roles SET ?", {
                title: answer.title,
                salary: answer.salary,
                dept_id: answer.dept_id,
            });
            mainMenu()
        },
        (err) => {
            if (err) throw err;
            console.log('new role been added\n');
        })
}
// function to add new Department
const addDept = () => {
    inquirer.prompt([{
        type: 'input',
        message: 'what is the new department',
        name: 'dept_name'
    }]).then((answer) => {
            connection.query("INSERT INTO department SET ?", {
                dept_name: answer.dept_name,
            });
        },
        (err, res) => {
            if (err) throw err;
            console.log('new Department been added\n');
            viewDept();
            mainMenu();
        })

}
// function to delete Employee
const removeEmp = () => {
    const queryRemove = `SELECT * FROM employee`
  connection.query(queryRemove, (err, res) => {
    if (err) throw err;
    inquirer.prompt([{
      type: 'rawlist',
      name: 'employeeID',
      message: 'Please select an employee that will be fired?',
      choices: res.map(employee => {
        return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
      })
    }]).then(answer => {
      const removedEmployee = 'DELETE FROM employee WHERE ?'
      connection.query(removedEmployee, [{ id: answer.employeeID }], (err) => {
        if (err) throw err;
        viewAll();
      })

    })
  })
}
// function to delete Department
const removeDept = () => {
    inquirer.prompt([{
        type: 'input',
        message: 'which department you whant to delete?',
        name: 'dep_name',
    }]).then((answe) => {
        connection.query(
            'DELETE FROM department WHERE ?', {
                dept_name: answer.dep_name,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} Department Removed!\n`);
                // Call viewAll AFTER the DELETE completes
                viewAll();
                mainMenu();
            }
        );

    })
}
// function to delete Role
const removeRole = () => {
    inquirer.prompt([{
        type: 'input',
        message: 'which role you whant to delete?',
        name: 'role_name',

    }]).then((answer) => {
        connection.query(
            'DELETE FROM roles WHERE ?', {
                title: answer.role_name,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} Role deleted!\n`);
                // Call viewAll AFTER the DELETE completes
                viewAll();
                mainMenu();
            }
        );
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
                    type: 'rawlist',
                    name: 'employee',
                    message: 'Please choose an employee?',
                    choices: chooseEmp
                },
                {
                    type: 'rawlist',
                    name: 'newRole',
                    message: 'Please choose new role',
                    choices: roles
                }
            ]).then((answer) => {
                connection.query('UPDATE employee SET employee.role_id = ? WHERE employee.id = ?', [answer.newRole, answer.employee], (err) => {
                    if (err) throw err;
                    viewAll();
                    mainMenu()
                });

            });
        });

    });
};
// function to update manager

// function to view Employee by manager
const viewEmpMang = () => {
    connection.query(
        `SELECT 
        a.first_name AS FirstName, a.last_name AS LastName, concat(b.first_name, ' ',b.last_name) as Manager FROM employee a LEFT OUTER JOIN employee b ON a.manager_id = b.id ORDER BY Manager;
        `, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    )

}
// function to view Department Budget



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
            
            "View Employees by Manager",
            
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
            case "View Employees by Manager":
                viewEmpMang();
                break;
            case "Exit":
                console.log('Goodbye!');
        }
    })
};

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