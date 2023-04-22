const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();
const figlet = require('figlet');
const Choices = require('./choices/choices.js');
//const choices = new(Choices);

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
    figlet('Employee Manager', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        promptUser(); // Call the inquirer prompt inside the figlet callback
    });
});
    
async function promptUser() {
    try {
        const { mainSelect } = await inquirer.prompt([
            /* Pass your questions in here */
            {
                type: 'list',
                name: 'mainSelect',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee', 'Quit']
            }
        ]);
        switch (mainSelect) {
            case 'View all departments':
                db.query(Choices.allDepartments, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        promptUser();
                    }
                });
                break;
            case 'View all roles':
                db.query(Choices.allRoles, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        promptUser();
                    }
                });
                break;
            case 'View all employees':
                db.query(Choices.allEmployees, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        promptUser();
                    }
                });
                break;
            case 'Add a department':
                const { departmentName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'Enter a new department name'
                    }
                ]);
                db.execute(Choices.addDepartment(departmentName), (error, result) => {
                    console.log(Choices.addDepartment);
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        console.log('Successfully added a new department');
                        promptUser();
                    }
                });
                break;
            case 'Add a role':
                const [rows] = await db.promise().query(`SELECT id, name FROM department`);
                const departmentChoices = rows.map((row) => ({
                    name: row.name,
                    value: row.id
                }));
                console.log(departmentChoices);
                const { roleTitle, roleSalary, roleDepartment } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'Enter a new role name'
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: "Enter a salary for the role"
                    },
                    {
                        type: 'list',
                        name: 'roleDepartment',
                        message: 'Select a department for the role',
                        choices: departmentChoices
                    }
                ]);
                //console.log(`name: ${roleTitle}, salary: ${roleSalary}, department: ${roleDepartment}`);
                promptUser();
                db.execute(Choices.addRole(roleTitle, roleSalary, roleDepartment), (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        console.log('Successfully added a new role');
                        promptUser();
                    }
                });
                break;
        }
    } catch (error) {
        if (error) {
            console.log(error);
          } 
    }
}
    