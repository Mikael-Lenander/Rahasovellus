# Finanece Tracker

The page can be found [here](https://rahasovellus.herokuapp.com/).

You should log in to see the full power of the website. You can log in with username `demouser` and password `vahvasalasana` to see a demo user with example data. The page works at least on Chrome and Firefox.

The page is an app to follow your income, expenses and capital growth. Once you have submitted enough transactions, there are several charts and statistics to give you insigts about your financial situation. You can also add your own categories for transactions or use the default ones.

## Structure and technologies

- frontend: React, Redux, d3.js
- backend: Express, Mongoose, Passport

The login system is implemented with Passport.js. User data is stored in express-session and sent to the user as a cookie. User data and transactions are stored in MongoDB.
