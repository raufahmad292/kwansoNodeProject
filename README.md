
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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




