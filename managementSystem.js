const mysql = require("mysql");
const inquirer = require('inquirer');

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

const viewAll = () => {
    connection.query('SELECT * FROM employee ',(err, res) => {
        if (err) throw err;
        res.forEach(({
            id,
            first_name,
            last_name,
            role_id,
            manager_id
        }) => {
            console.log(`| ${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id} |`);
        });
        console.log('-----------------------------------');
        mainMenu();
    });
};

const viewDept = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(({
            id,
            dept_name,
        }) => {
            console.log(`| ${id} | ${dept_name} |`);
        });
        console.log('-----------------------------------');
        mainMenu();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        res.forEach(({
            id,
            title,
            salary,
            dept_id,

        }) => {
            console.log(` | ${id} | ${title} | ${salary} | ${dept_id} |`);
        });
        console.log('-----------------------------------');
        mainMenu();
    });
};

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
        {
            type: 'list',
            name: 'department',
            message: 'Please Chose Depatment',
            choices: ['HR', 'IT', "Finance", 'Legal'],
        },
        {
            type: 'list',
            name: 'role',
            message: 'Pleas enter employee role?',
            choices: ['Manager', 'Tec Support', 'Accountant', 'Lawyer', 'Tea Boy']
        },

    ]).then((answer) => {
            console.log(answer)
            const query = connection.query("INSERT INTO employee SET ?", {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role,
            });
        },
        (err, res) => {
            if (err) throw err;
            console.log('employee inserted!\n');
            // Call updateProduct AFTER the INSERT completes
            mainMenu();
        })
}

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
            const query = connection.query("INSERT INTO roles SET ?", {
                title: answer.title,
                salary: answer.salary,
                dept_id: answer.dep_id,
            });
        },
        (err, res) => {
            if (err) throw err;
            console.log('new role been added');
            mainMenu();
        })
}

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
            console.log('new Department been added');
            mainMenu();
        })

}
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
                mainMenu();
            }
        );

    })

}
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
            mainMenu();
        }
    );

    })
}

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
                console.log(`${res.affectedRows} products deleted!\n`);
                // Call readProducts AFTER the DELETE completes
                mainMenu();
            }
        );
    })
}
const updateRole = () => {

}
const updateMang = () => {

}
const viewEmpMang = () => {

}
const viewBudget = () => {
    connection.query('SELECT dept_name, SUM salary FROM employees GROUP BY dept_name;')

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
    console.log(` xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`);
    console.log(` x-------------------------------------x`);
    console.log(` |                                     |`);
    console.log(`  Welcome to Ahmed's Management System  `);
    console.log(` |                                     |`);
    console.log(` x-------------------------------------x`);
    console.log(` xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`);
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