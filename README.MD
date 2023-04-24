#### Project Setup

In order to spin up the project, in the root create .env with these two variables, with your own values.

DB_TOKEN
JWT_SECRET
JWT_SPAN

After that run this command

```bash
npm install && npm start
```
####  Database Connections

1. Import connect.js
2. Invoke in start()
3. Setup .env in root
4. Add DB_TOKEN

#### Routers

- auth.js
- task.js

#### User Model

*Validator Function for User Registeration Validation

#### Register User

- Validate -name, userName, email, password - with Mongoose
- Hash Password (with bcrypt)
- Save User
- Generate Token
- Send Response with token

#### Login User

- Validate - email or userName, Password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Task Model

- Generate Schema {Todo, description, createAt, createdBy} 
- use CreatedBy as Foregin Key
- Pass Jwt-Validate Middleware on Each route of Task Api call

#### Get-ALL-Task Route

- For filter Search  "todo" query
- For sort use on desending order pass sort=-createdAT ascending is default
- For Pagination pass Page&Limit req.query 

#### GetTask && UpdateTask && DeleteTask && createTask

- This API Fetch single Task with Paramid as ObjectId of Task
- Perform CRUD operation respective to their api call


#### cron && NodeMailer
- Scheduling and Notification Of Todo throught Mail

#### Additional Security

- helmet
- cors
- xss-clean
- express-rate-limit
