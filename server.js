const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection({
      host: 'localhost',
      // MySQL username,
      user: process.env.USER,
      // MySQL password
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    });
  
db.connect((error) => {
    if (error) throw error
    console.log(`Connected to the database.`);

    inquirer.prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'departments',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
            }
        ])
        .then((answers) => {
            // Use user feedback for... whatever!!
            console.table([answers]);
        })
        .catch((error) => {
            if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            } else {
            // Something else went wrong
            }
        });
});
