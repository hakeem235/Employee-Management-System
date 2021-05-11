-- Creat Database

DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  dept_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (dept_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert Data

INSERT INTO 
department(dept_name) 
VALUES 
("HR"), 
("IT"),
("Finance"),
("Legal");

INSERT INTO 
roles(title, salary, dept_id) 
VALUES 
("Manager", 90000, 1), 
("Tec Support", 80000, 2),
("Accountant", 70000, 2), 
("Lawyer", 75000, 1), 
("Tea Boy", 5000, 1);

INSERT INTO 
employee(first_name, last_name, role_id, manager_id) 
VALUES 
("Ahmed", "Hakeem", 1, Null), 
("Jeff", "Bezos", 4, 1), 
("ELon", "Musk", 3, 1), 
("Bill", "Gates", 2, 1), 
("Bill", "Hwelett", 5, 1, 
("Dave", "Packard", 3, 1);