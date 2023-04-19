DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    title VARCHAR(25) NOT NULL,
    department VARCHAR(25) NOT NULL,
    salary INT(10) NOT NULL,
    manager VARCHAR(25)
);

updated