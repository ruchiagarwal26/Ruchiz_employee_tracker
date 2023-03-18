
// Import and require mysql2
import mysql from 'mysql2';
//Import Inquirer and table libraries
import inquirer from 'inquirer';
import consoleTable from 'console.table';
import promise from 'promise';

console.log ("Welcome to Employee Tracker ");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'hello123',
    database: 'employee_department'
  },
  console.log(`Connected to the employee_department database.`)
);

db.promise().query("select concat(first_name, ' ', last_name) as employee_name, id as employee_id from employee", 
                function (err, results) {
                const employee = results.map(({ employee_name , employee_id }) => ({ name:employee_name, value: employee_id}));
                    
    inquirer.prompt([
            {type: 'list',
            name: 'employee',
            massage: 'select employee whose role needs to be updated',
            choices : employee
            },
            ]).
            then (function(answer){

                const params = [answer.employee];
            
            db.query("select concat(m.first_name, ' ', m.last_name) as manager_name, id as manager_id from manager m", 
                function (err, results) {
                const manager = results.map(({ manager_name , manager_id }) => ({ name:manager_name, value: manager_id}));
        
                inquirer.prompt([
                 {  type: 'list',
                    name: 'manager',
                    massage: 'select Manager',
                    choices : manager
                }
                ])
                .then(function(answer){
                    const manager = answer.manager;
                   
                    params.push(manager);
                   

            db.query('select title as role, id as role_id from role', 
                function (err, results) {
                const role = results.map(({ role , role_id }) => ({ name:role, value: role_id}));
                   
                inquirer.prompt([
                 {  type: 'list',
                    name: 'role',
                    massage: 'select role',
                    choices : role
                }
                ])
                .then(function(answer){
                    const role = answer.role;
                 
                    params.push(role);
                   

            db.query('update employee set role_id = ? where employee_id = ? and manager_id= ? ',[params[2], params[0], params[1]] , function (err, results) {
                       console.log(`\u001b[32m \n Updated the role ;`)})
                })


            }) 
                
            });   
           
        });
        })
    })