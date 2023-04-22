const Choices = {
        allDepartments: `SELECT * FROM department;`,
        allRoles: `SELECT r.id, r.title AS job_title, r.salary, d.name 
                    FROM role r
                    INNER JOIN department d ON r.department_id = d.id;`,
        allEmployees: `SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employee e
                    LEFT JOIN role r ON e.role_id = r.id
                    LEFT JOIN department d ON r.department_id = d.id
                    LEFT JOIN employee m ON e.manager_id = m.id;`,
        addDepartment: (departmentName) => `INSERT INTO department (name) VALUES ('${departmentName}')`
}

module.exports = Choices;