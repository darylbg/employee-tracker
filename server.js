const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();
const figlet = require('figlet');
const Choices = require('./choices/choices.js');

const db = mysql.createConnection({
      host: 'localhost',
      // MySQL username,
      user: process.env.USER,
      // MySQL password
      password: process.env.PASSWORD,
      database: process.env.DATABASE
});
// Figlet package used to render text art in console
db.connect((error) => {
    if (error) throw error
    figlet('Employee Manager', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        promptUser();
    });
});
// Inquirer package prompts 
async function promptUser() {
    // Main menu prompts defined here
    try {
        const { mainSelect } = await inquirer.prompt([
            {
                type: 'list',
                name: 'mainSelect',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
            }
        ]);
        // Specifies quieries to the database based on which prompt was selected from main menu
        switch (mainSelect) {
            case 'View all departments':
                db.query(Choices.getDepartments, (error, result) => {
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
            // A new prompt is triggerred for user to input new role
            case 'Add a department':
                const { departmentName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'Enter a new department name'
                    }
                ]);
                // New role created is put into database
                db.execute(Choices.addDepartment(departmentName), (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Successfully added ${departmentName} department`);
                        // User returned to main menu
                        promptUser();
                    }
                });
                break;
            case 'Add a role':
                const [departments] = await db.promise().query(Choices.getDepartments);
                const departmentChoices = departments.map((department) => ({
                    name: department.department_name,
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
                        message: "Enter a salary for the role",
                        validate: function(value) {
                            // Use a regular expression to check if the input is a number
                            const regex = /^[0-9]+$/;
                            if (value.match(regex)) {
                              return true;
                            } else {
                              return 'Please enter a valid number.';
                            }
                        },
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
                        console.log(`Successfully added ${roleTitle} role`);
                        promptUser();
                    }
                });
                break;
            case 'Add an employee':
                const [currentRoles] = await db.promise().query(Choices.getRoles);
                const currentRolesChoices = currentRoles.map((currentRole) => ({
                    name: currentRole.title,
                    value: currentRole.id
                }));
                const [currentManagers] = await db.promise().query(Choices.getManagers);
                const currentManagersChoices = currentManagers.map((currentManager) => ({
                    name: currentManager.name,
                    value: currentManager.id
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
                        message: "select the employee's role",
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
                        console.log(`Successfully added ${firstName} ${lastName} as a new employee`);
                        promptUser();
                    }
                });
                break;
            case 'Update an employee role':
                const [currentEmployees] = await db.promise().query(Choices.getEmployees);
                const currentEmployeesChoices = currentEmployees.map((currentEmployee) => ({
                    name: currentEmployee.name,
                    value: currentEmployee.id
                }));
                const [updateRoles] = await db.promise().query(Choices.getRoles);
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
                        const selectedEmployee = currentEmployees.find(employee => employee.id === employees);
                        const selectedRole = updateRoles.find(role => role.id === roles);
                        console.log(`Successfully updated ${selectedEmployee.name}'s role to ${selectedRole.title}`);
                        promptUser();
                    }
                });
                break;
            case 'Quit':
                console.log('Successfully exited the employee manager program!');
                process.exit();
                break;
        }
    } catch (error) {
        if (error) {
            console.log(error);
          } 
    }
}
    