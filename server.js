// Import and require mysql2
import mysql from "mysql2";
//Import Inquirer and table libraries
import inquirer from "inquirer";
import consoleTable from "console.table";

console.log("Welcome to Employee Tracker ");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "hello123",
    database: "employee_department",
  },
  console.log(`Connected to the employee_department database.`)
);

inquirer
  .prompt([
    {
      type: "list",
      message: "Please select an option you are looking for : ",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "update Employee's role",
        //bonus
        "total utilized budget of a department",
      ],
      name: "querySelect",
    },
  ])
  .then(function (answer) {
    const querySelection = answer;
// to view all Departments
    if (querySelection.querySelect == "View All Departments") {
      console.log(
        "\u001b[32m \n Please find below the list of all Departments"
      );
      db.promise().query(
        "select department as department_name, id as department_id from department"
      ).then((results)=> {
        console.table("\u001b[34m", results[0]);
      });
    }
    // To view all roles
    if (querySelection.querySelect == "View All Roles") {
      console.log("\u001b[32m \n Please find below the list of existing roles");
      db.promise().query(
        "select title as job_title, r.id as role_id,d.department as department_name, salary \n" +
          "from role r inner join department d \n" +
          "on d.id = r.department_id",
          ).then((results)=> {
            console.table("\u001b[34m", results[0]);
        });
    }
    //To view all employees
    if (querySelection.querySelect == "View All Employees") {
      console.log("\u001b[32m \n Please find below the list of all employees");
      db.promise().query(
        " select e.id as employee_id, e.first_name, e.last_name,title as job_title, \n" +
          "d.department, r.salary, concat(m.first_name, ' ', m.last_name) as manager \n" +
          "from employee e \n" +
          "left join role r on r.id = e.role_id \n" +
          "left join department d on r.department_id = d.id \n" +
          "left join manager m on m.employee_id = e.id",
        //function (err, results) {
          //console.table("\u001b[34m", results);
          ).then((results)=> {
            console.table("\u001b[34m", results[0]);
        }
      );
    }
    //to add department
    if (querySelection.querySelect == "Add Department") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "addDepartment",
            message: "please enter the department name you want to add",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          db.query(
            "insert IGNORE into department (department) values(?) ",
            answer.addDepartment,
            function (err, results) {
              console.log(
                `\u001b[32m \n Added new Department : ${answer.addDepartment} \n New Department table :`
              );
              db.promise().query(
                "select department as department_name, id as department_id from department",
                //function (err, results) {
                  //console.table("\u001b[34m", results);
                  ).then((results)=> {
                    console.table("\u001b[34m", results[0]);
                }
              );
            }
          );
        });
    }
    if (querySelection.querySelect == "Add Role") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "addTitle",
            message: "please enter the Title of the Role you want to add",
          },
          {
            type: "input",
            name: "addSalary",
            message: "please enter the Salary for this Role",
          },
        ])
        .then(function (answer) {
          const params = [answer.addTitle, answer.addSalary];

          db.query(
            "select department as department_name, id as department_id from department",
            function (err, results) {
              const dept = results.map(
                ({ department_name, department_id }) => ({
                  name: department_name,
                  value: department_id,
                })
              );
              console.log(" dept ", dept);
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "dept",
                    massage: "select department",
                    choices: dept,
                  },
                ])
                .then(function (answer) {
                  const dept = answer.dept;
                  console.log("next dept ", dept);
                  params.push(dept);
                  console.log("Params ", params);
                  db.query(
                    "insert IGNORE into role (title, salary,department_id) values(?, ?, ?) ",
                    params,
                    function (err, results) {
                      console.log(`\u001b[32m \n Added new Role : ${params}`);
                    }
                  );
                });
            }
          );
        });
    }

    // Code for adding new employee
    if (querySelection.querySelect == "Add Employee") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "fn",
            message: "please enter the First name of the employee",
          },
          {
            type: "input",
            name: "ln",
            message: "please enter the Last name of the employee",
          },
        ])
        .then(function (answer) {
          const params = [answer.fn, answer.ln];

          db.query(
            "select title as role, id as role_id from role",
            function (err, results) {
              const role = results.map(({ role, role_id }) => ({
                name: role,
                value: role_id,
              }));
              console.log(" role ", role);
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    massage: "select role",
                    choices: role,
                  },
                ])
                .then(function (answer) {
                  const role = answer.role;
                  console.log("next role ", role);
                  params.push(role);
                  console.log("Params ", params);

                  db.query(
                    "select concat(m.first_name, ' ', m.last_name) as manager_name, id as manager_id from manager m",
                    function (err, results) {
                      const manager = results.map(
                        ({ manager_name, manager_id }) => ({
                          name: manager_name,
                          value: manager_id,
                        })
                      );
                      console.log(" manager ", manager);
                      inquirer
                        .prompt([
                          {
                            type: "list",
                            name: "manager",
                            massage: "select Manager",
                            choices: manager,
                          },
                        ])
                        .then(function (answer) {
                          const manager = answer.manager;
                          console.log("next manager ", manager);
                          params.push(manager);
                          console.log("Params ", params);
                          db.query(
                            "insert into employee (first_name, last_name,role_id, manager_id) values(?, ?, ?, ?) ",
                            params,
                            function (err, results) {
                              console.log(
                                `\u001b[32m \n Added new Employee : ${params}`
                              );
                            }
                          );
                        });
                    }
                  );
                });
            }
          );
        });
    }
    if (querySelection.querySelect == "update Employee's role") {
      db.query(
        "select concat(first_name, ' ', last_name) as employee_name, id as employee_id from employee",
        function (err, results) {
          const employee = results.map(({ employee_name, employee_id }) => ({
            name: employee_name,
            value: employee_id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                massage: "select employee whose role needs to be updated",
                choices: employee,
              },
            ])
            .then(function (answer) {
              const params = [answer.employee];

              db.query(
                "select concat(m.first_name, ' ', m.last_name) as manager_name, id as manager_id from manager m",
                function (err, results) {
                  const manager = results.map(
                    ({ manager_name, manager_id }) => ({
                      name: manager_name,
                      value: manager_id,
                    })
                  );

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        massage: "select Manager",
                        choices: manager,
                      },
                    ])
                    .then(function (answer) {
                      const manager = answer.manager;

                      params.push(manager);

                      db.query(
                        "select title as role, id as role_id from role",
                        function (err, results) {
                          const role = results.map(({ role, role_id }) => ({
                            name: role,
                            value: role_id,
                          }));

                          inquirer
                            .prompt([
                              {
                                type: "list",
                                name: "role",
                                massage: "select role",
                                choices: role,
                              },
                            ])
                            .then(function (answer) {
                              const role = answer.role;

                              params.push(role);

                              db.query(
                                "update employee set role_id = ? where employee_id = ? and manager_id= ? ",
                                [params[2], params[0], params[1]],
                                function (err, results) {
                                  console.log(
                                    `\u001b[32m \n Updated the role ;`
                                  );
                                }
                              );
                            });
                        }
                      );
                    });
                }
              );
            });
        }
      );
    }
    //Bonus point requirement -- budget per department
    if (querySelection.querySelect == "total utilized budget of a department") {
        db.promise().query('with salary as (	\n' +
            'select (count(distinct e.id) * salary) as sal , department \n' +
            'from role r \n' +
            'inner join department d on r.department_id=d.id \n' +
            'left join employee e on e.role_id = r.id \n' +
            'group by salary, department) \n' +
            'select 	sum(sal) as Salary, department from salary \n' +
            'group by department;',
            //function (err, results) {
              //console.table("\u001b[34m", results);
              ).then((results)=> {
                console.table("\u001b[34m", results[0]);
            })

    }
  });
