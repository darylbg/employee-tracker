INSERT INTO employees (id, first_name, last_name, title, department, salary, manager)
VALUES (1, 'John', 'Doe', 'Sales Lead', 'Sales', 100000, ''),
       (2, 'Mike', 'Chan', 'Sales Person', 'Sales', 70000, 'John Doe'),
       (3, 'Ashley', 'Rodriquez', 'Lead Engineer', 'Engineering', 52000, ''),
       (4, 'Kevin', 'Tupik', 'Software Engineer', 'Engineering', 80000, 'Ashley Rodriquez'),
       (5, 'Kunal', 'Singh', 'Account Manager', 'Finance', 63000, ''),
       (6, 'Malia', 'Brown', 'Accountant', 'Finance', 78800, 'Kunal Singh'),
       (7, 'Sarah', 'Lourd', 'Legal Team Lead', 'Legal', 5000, ''),
       (8, 'Tom', 'Allen', 'Lawyer', 'Legal', 45000, 'Sarah Lourd'),
       (9, 'Sam', 'Kash', 'Sales Lead', 'Sales', 100000, 'Ashley Rodriquez')