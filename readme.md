
# Test_App

## App startup
****

```bash
#installing dependencies
$ npm install

#launch the app
$ npm start
```

## About app
****

Initially, the application creates one user in table "users"

### Table "users":
```bash
 id | balance 
----+---------
  1 |   10000
```

### App routes:
1. **Route to increase balance of user with id = userId**
    - /user/:userId/incBalance
2. **Route to decrease balance of user with id = userId**
    - /user/:userId/decBalance
