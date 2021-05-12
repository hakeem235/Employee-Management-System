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

// 
const viewAll = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        res.forEach(({
            id,
            first_name,
            last_name,
            role_id,
            manager_id
        }) => {
            console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id} |`);
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
            console.log(`${id} | ${dept_name} |`);
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
            console.log(`${id} | ${title} | ${salary} | ${dept_id} |`);
        });
        console.log('-----------------------------------');
        mainMenu();
    });
};
const addEmp = () => {
    

}
const addRole = () => {

}
const addDept = () => {

}
const removeEmp = () => {

}
const removeDept = () => {

}
const removeRole = () => {

}
const updateRole = () => {

}
const updateMang = () => {

}
const viewEmpMang = () => {

}
const viewBudget = () => {

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
    console.log(` x                                     x`);
    console.log(`            `);
    console.log(`   Welcome to Ahmed's Management System `);
    console.log(`            `);
    console.log(` x                                     x`);
    console.log(` xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`);
    console.log(`            `);
};

// Start Program Function
function init() {
    // with welcome message
    welcome();
    // then firing main menu
    mainMenu();
}

// Starting Program
init();