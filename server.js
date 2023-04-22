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
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
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
                const [departments] = await db.promise().query(`SELECT id, name FROM department`);
                const departmentChoices = departments.map((department) => ({
                    name: department.name,
                    value: department.id
                }));
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
            case 'Add an employee':
                const [currentRoles] = await db.promise().query(`SELECT id, title FROM role`);
                const currentRolesChoices = currentRoles.map((currentRole) => ({
                    name: currentRole.title,
                    value: currentRole.id
                }));
                const [currentManagers] = await db.promise().query(`SELECT manager_id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NOT NULL`);
                const currentManagersChoices = currentManagers.map((currentManager) => ({
                    name: currentManager.name,
                    value: currentManager.manager_id
                }));
                const { firstName, lastName, role, manager } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "Enter the employee's first name"
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Enter the employee's last name"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "select the employee's manager",
                        choices: currentRolesChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Select the employee's manager",
                        choices: currentManagersChoices
                    },
                ]);
                db.execute(Choices.addEmployee(firstName, lastName, role, manager), (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result);
                        console.log('Successfully added a new employee');
                        promptUser();
                    }
                });
                break;
            case 'Update employee role':
                const [currentEmployees] = await db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
                const currentEmployeesChoices = currentEmployees.map((currentEmployee) => ({
                    name: currentEmployee.name,
                    value: currentEmployee.id
                }));
                const [updateRoles] = await db.promise().query(`SELECT id, title FROM role`);
                const updateRolesChoices = updateRoles.map((updateRole) => ({
                    name: updateRole.title,
                    value: updateRole.id
                }));
                const { employees, roles } = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'employees',
                      message: 'Select which employee you want to update',
                      choices: currentEmployeesChoices
                    },
                    {
                      type: 'list',
                      name: 'roles',
                      message: 'Select which role you want to update the employee to',
                      choices: updateRolesChoices
                    }
                  ]);                  
                db.execute(Choices.uRole(roles, employees), (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.table(result)
                        console.log('Successfully updated employees role');
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
    