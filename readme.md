# Full Stack Coding Challenge

Task Details:

We need to run some reports on data for calls run on our system since the start of the year.

This data is contained in three files hosted in a private S3 bucket called `coviu-challenges`, located in the `ap-southeast-2` region. These three files are:

- data/backend/calls.json
- data/backend/teams.json
- data/backend/users.json

Your task is to retrieve these files, and use the data in them to answer the following questions:

1. Which user(s) had the most calls?

2. Which team conducted the least calls in March?

3. If a call duration under 2 minutes is an indicator of a problem with a call, which user is the most likely to have issues with their connection?

# Prerequisite
- node 12
- npm 6

# Installation
```shell script
$ npm i
```

Copy `.env.example` into `.env`
```
$ cp .env.example .env
```

Refill blank values for environment variables in `.env`
```shell script
AWS_ACCESS_KEY_ID=
AWS_ACCESS_KEY_SECRET=
AWS_REGION=
```

# How to Run
Start express server
```shell script
$ npm start
```


##task1
query users by default query params
```shell script
localhost:8080/users
```

##task2
```shell script
localhost:8080/teams
```

##task3
query users by condition and sort
```shell script
localhost:8080/users?condition[type]=duration&condition[unit]=minute&condition[amount]=2&sort[type]=likelihood
```

# How to test
```shell script
$ npm test
```

## Tech stack

- [x] [Typescript](https://www.typescriptlang.org/)
- [x] [Express](https://www.npmjs.com/package/eslint)
- [x] [AWS SDK](https://www.npmjs.com/package/eslint)
- [x] [Jest](https://www.npmjs.com/package/jest)
- [x] [Eslint](https://www.npmjs.com/package/eslint)


