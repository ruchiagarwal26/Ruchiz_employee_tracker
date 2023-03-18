use employee_department;

insert into role (title, salary,department_id)
values ("Salesperson", 80000 , 1 ),
("Lead Engineer", 15000, 2),
("Accountmanager", 16000, 3),
("Accountant", 12000, 3 ),
("Legal Team Lead", 25000, 4),
("Lawyer", 19000, 4);

insert into employee (first_name , last_name, role_id, manager_id)
values
("Mike", "Chan", 1 , 1),
("Ashley", "R", 2 , 2),
("Kevin", "Tupok", 2 , 2),
("Kunal", "Singh", 3 , 3),
("Malia", "Brown", 3 , 3),
("Sarah", "L", 4 , 4),
("Tom", "Allen", 4 , 4)

insert into manager (first_name , last_name, employee_id)
values("Dave", "Thompson", 1 ),
("Brian", "Clark", 2 ),
("Brian", "Clark", 3 ),
("Ravi", "Mehta", 4 ),
("Ravi", "Mehta", 5 ),
("Sam", "Chan", 6),
("Sam", "Chan", 7);

/*view all departments*/
select department as department_name, id as department_id from department
 ;
 
 /*WHEN I choose to view all roles*/
 
 select title as job_title, r.id as role_id, d.department as department_name, salary 
 from role r
 inner join department d on d.id = r.department_id
 ;
 

 /*WHEN I choose to view all employees*/
 select e.id as employee_id, e.first_name, e.last_name
 ,title as job_title, d.department, r.salary, concat(m.first_name, ' ', m.last_name) as manager
 from employee e
 left join role r on r.id = e.role_id
 left join department d on r.department_id = d.id
 left join manager m on m.employee_id = e.id;