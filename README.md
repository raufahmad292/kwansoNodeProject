
## Description

Node version 18.16.0 should be installed and used

## Installation

```bash
$ npm i --force
```
## Database Set
Database Creation 
Run following command on my sql server

```bash
 $ create database kwanso 
```
set your sql password, username, port in the '/src/typeorm/typeorm.module.ts' file

## Seeder File Run
npx ts-node src/seeds/seed.ts 

```bash
 $ npx ts-node src/seeds/seed.ts 
```

first admin user is created with 
username: admin
password: adminpassword 
role:1 

role 1 means admin and role 0 means simple user

## Running the app
```bash
# development
$ npm run start

## Test
Open Link
http://localhost:3000/api

Now First  Use auth/sign in api with
{
  "username":"admin",
  "password":"adminpassword"
}
to get bearer token ,add this bearer token in authorize now you can use other apis

Signup Api Description:

Before Using Sign Up you have to use create invitation api, because signup can be done on invited users only,
never confuse between email and username it is same column

Get Task Api Description

UserFilter accepts Username example rauf@gmail.com
Limit accepts No of Maximum rows you want example 5
Off accepts No Of Starting Index example 0
status can be Completed or Pending

Design Pattern
I have used multiple design pattern in this solution , modular structure is made , I have made 4 diffierent modules these are users module,
task module, invitation module and typeorm module.

MVC (Model-View-Controller):
The MVC pattern is fundamental to the structure of the solution. Controllers handle incoming requests, interact with services to process data, and return responses. Services contain the business logic, perform operations on data, and interact with repositories. Models represent the data structure and are used to define entities such as users, tasks, and invitations.

Dependency Injection (DI):
Dependency Injection is extensively used to manage the dependencies between various components of the application. Services and other dependencies are injected into controllers and other components, promoting modularity and testability.

Repository Pattern:
The repository pattern is utilized, particularly in database interactions.




