Packages - npm i

Fill the .env

Start - npm start

This app use Express.js, TypeScript, MongoDB

Take host & port from .env or use http://localhost:8080

1. Get Available Countries - GET http://localhost:8080/available-countries

2. Get Country Info by Code - GET http://localhost:8080/country-info?code=UA

3. Add national holidays of a specific country to the user’s calendar by userId - POST http://localhost:8080/users/67ebda56f36a5ebf990bce6c/calendar/holidays
I provide an exist user's id from mongoDB

