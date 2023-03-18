create database employee_department;

use employee_department;

create table department
(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department varchar (50) NOT NULL );

create table role
(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title varchar(30),
salary decimal,
department_id int,
FOREIGN KEY (department_id)
  REFERENCES department(id)
);

create table employee(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name varchar(30),
last_name varchar(30),
role_id int,
manager_id int,
FOREIGN KEY (role_id)
  REFERENCES role(id)
);

create table manager(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name varchar(30),
last_name varchar(30),
employee_id int,
FOREIGN KEY (employee_id)
  REFERENCES employee(id)
);

insert into department (department)
values ("Sales"),
("Engineering"),
("Finance"),
("Legal");
