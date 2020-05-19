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
AWS_REGION=ap-southeast-2
```

# How to Run
Start express server
```shell script
$ npm start
```

main url `localhost:8080`

# How to use
`/users` support query for filter, sort and limit which following rules like

Filter
- `filter[type]`:
    - `duration` filter by call's duration, companion with filter[amount] & filter[unit]
- `filter[unit]`:
    - `second`
    - `minute` (default)
    - `hour`
- `filter[amount]` amount based on unit, default 1
- `filter[operator]`: (working in progress) 

Sort
- `sort[type]`:
    - `count` (default): count of occurrence (could be conditional by filter)
    - `likelihood` ratio to occurrence / total
- `sort[order]`:
    - `desc` (default): descending order 
    - `asc` ascending order 

Limit
- `limit` number of response result

Group
- `group[type]`
    - `call` (default): group by call

### Example
Get 3 users who had most of less than 1 min call
  
`/users?filter[type]=duration&filter[unit]=minute&filter[amount]=1&sort[type]=count&limit=3`
  
Response
  
```json
[
    {
        "id": 80,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    },
    {
        "id": 97,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    },
    {
        "id": 78,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    }
]
```

###### */teams not supported yet

## Task1
Which user(s) had the most calls?

Solution: query users by default query params  
`/users`  
equivalent to  
`/users?sort[type]=count&sort[order]=desc&limit=1`

## Task2
Which team conducted the least calls in March?

solution: query users by default query params  
`/teams`

## Task3
If a call duration under 2 minutes is an indicator of a problem with a call, which user is the most likely to have issues with their connection?

solution: query users by filters and sort  
`/users?filter[type]=duration&filter[unit]=minute&filter[amount]=2&sort[type]=likelihood`

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


## TODO
- more integration test
- filter operator
- `/teams` supports filter and sorting