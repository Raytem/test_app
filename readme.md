
# Test_App

## App startup
****

### Locally (only 1 replica)
```bash
#go to the project directory
$ cd path/to/projectDirectory

#installing dependencies
$ npm install

#launch the app
$ npm start
```

### In Docker containers (5 replicas)
```bash
#go to the project directory
$ cd path/to/projectDirectory

#build an image of app
$ docker build -t test_task-app .

#launch the app
$ docker-compose up
```

## About app
****
App starts on port 80
Initially, the application creates one user in table "users" and 10 tasks in table "cronTasks"

### Table "users":
```bash
 id | balance 
----+---------
  1 |   10000
```

### Table "cronTasks"
```bash
 id |  name  |   interval   |   status    | startTime | server 
----+--------+--------------+-------------+-----------+--------
  1 | TASK1  | */2 * * * *  | UNSCHEDULED |           | 
  2 | TASK2  | */3 * * * *  | UNSCHEDULED |           | 
  3 | TASK3  | * * * * *    | UNSCHEDULED |           | 
  4 | TASK4  | */10 * * * * | UNSCHEDULED |           | 
  5 | TASK5  | * * * * *    | UNSCHEDULED |           | 
  6 | TASK6  | */7 * * * *  | UNSCHEDULED |           | 
  7 | TASK7  | */5 * * * *  | UNSCHEDULED |           | 
  8 | TASK8  | * * * * *    | UNSCHEDULED |           | 
  9 | TASK9  | */4 * * * *  | UNSCHEDULED |           | 
 10 | TASK10 | * * * * *    | UNSCHEDULED |           | 
```

### App routes:
1. **Route to increase the balance of user**
    - method: PATCH
    - path: /user/:userId/incBalance
    - body: { amount: number }
    
2. **Route to decrease the balance of user**
    - method: PATCH
    - path: /user/:userId/decBalance
    - body: { amount: number }
    
3. **Route to get all cronTasks**
    - method: GET
    - path: /cronTask
 
4. **Route to get all completed tasks**
    - method: GET
    - path: /cronTask/completed

5. **Route to update cronTask**
    - method: PATCH
    - path: /cronTask/:taskId
    - body: { name: string, interval: string(cronExpression) }
