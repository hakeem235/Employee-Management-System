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
    const choiceRole = [];
    const choiceArray = [];
    const choiceManager = [];
    const departmentQuery = () => {
        connection.query('SELECT * FROM department', (err, results) => {
            if (err) throw err;
            results.forEach((dept) => {
                choiceArray.push({
                    name: dept.dept_name,
                    value: dept.id
                })
            });

        })
    }
    const roleQuery = () => {
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            results.forEach((role) => {
                choiceRole.push({
                    name: role.title,
                    value: role.id,
                })
            })
        })

    }
    const managerQuery = () => {
        connection.query('SELECT * FROM employee where role_id = 1', (err, results) => {
            if (err) throw err;

            results.forEach((manager) => {
                choiceManager.push({
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                })
            })
        })
    }
    managerQuery();
    roleQuery();
    departmentQuery();
    try {
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
            {
                name: 'department',
                type: 'rawlist',
                choices: choiceArray,
                message: 'Please Chose Department',

            },
            {
                name: 'role',
                type: 'rawlist',
                choices: choiceRole,
                message: 'Pleas enter employee role?'
            },
            {
                name: 'manager',
                type: 'rawlist',
                choices: choiceManager,
                message: 'Please choose a manager?'

            }

        ]).then((answer) => {
            let chosenDept;
            results.forEach((item) => {
                if (item.dept_id === answer.department) {
                    chosenDept = item;
                }
                let chosenRole;
                if (item.title === answer.role) {
                    chosenRole = item;
                }
            });
            connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    dept_name: answer.department,
                    // title: answer.role
                },
                (err) => {
                    if (err) throw err;
                    console.log('employee inserted!\n');
                    // Call updateProduct AFTER the INSERT completes
                    mainMenu();
                }
            );
        });
    } catch (err) {
        console.log(err)
    }
}
// function to add new Role
const addRole = () => {
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
            type: 'input',
            message: 'what is the department ID',
            name: 'dep_id'
        }

    ]).then((answer) => {
            console.log(answer)
            connection.query("INSERT INTO roles SET ?", {
                title: answer.title,
                salary: answer.salary,
                dept_id: answer.dep_id,
            });
        },
        (err) => {
            if (err) throw err;
            console.log('new role been added\n');
            mainMenu();
        })
}
// function to add new Department
const addDept = () => {


    inquirer.prompt([{
        type: 'input',
        message: 'what is the new department',
        name: 'dept_name'
    }]).then((answer) => {
            console.log(answer)
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
    inquirer.prompt([{
        type: 'input',
        message: 'Enter employee ID',
        name: 'emp_id',
    }]).then((answer) => {
        const query = connection.query(
            'DELETE FROM employee WHERE ?', {
                id: answer.emp_id,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} Employee Removed!\n`);
                // Call viewAll AFTER the DELETE completes
                viewAll();
                mainMenu();
            }
        );
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
    connection.query('SELECT employee.id,first_name, last_name, title,dept_name, salary FROM employee INNER JOIN roles ON employee.role_id=roles.id INNER JOIN department ON roles.dept_id=department.id', (err, results) => {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([{
                    name: 'choice',
                    type: 'rawlist',
                    choices() {
                        const choiceArray = [];
                        results.forEach(({
                            first_name,
                            last_name
                        }) => {
                            choiceArray.push(first_name, last_name);
                        });
                        return choiceArray;
                    },
                    message: 'select the employess?',
                },
                {
                    name: 'new_role',
                    type: 'input',
                    message: 'what is the new role?',
                },
            ])
            .then((answer) => {
                // get the information of the chosen item
                let chosenRole;
                results.forEach((item) => {
                    if (item.title === answer.choice) {
                        chosenRole = item;
                    }
                });

                // bid was high enough, so update db, let the user know, and start over
                connection.query(
                    'UPDATE employee SET ? WHERE ?',
                    [{
                            title: answer.new_role,
                        },
                        {
                            role_id: chosenRole.id,
                        },
                    ],
                    (error) => {
                        if (error) throw err;
                        console.log('Bid placed successfully!');
                        viewAll()
                        mainMenu();
                    }
                );
            });
    });
};
// function to update manager
const updateMang = () => {

    connection.query('UPDATE employee SET column_name = new_value WHERE condition');
}
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
const viewBudget = () => {
    inquirer.prompt([{
        type: 'rewlist',
        message: 'whice department you need to knowe there budget?',
        name: 'dep_budget'
    }]).then((answe) => {
        connection.query('SELECT dept_id, SUM (salary) FROM roles GROUP BY dept_id;', {
                dept_id: answe.dep_budget
            },
            (err, res) => {
                if (err) throw err;
                console.table(res)
                mainMenu();
            })
    })

}


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
            "Update Employee Manager",
            "View Employees by Manager",
            "View the total budget of a department",
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
            case "Update Employee Manager":
                updateMang();
                break;
                break;
            case "View Employees by Manager":
                viewEmpMang();
                break;
            case "View the total budget of a department":
                viewBudget();
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