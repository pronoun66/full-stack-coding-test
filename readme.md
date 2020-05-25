# Full Stack Coding Challenge

Task Details:

We need to run some reports on data for calls run on our system since the start of the year.

This data is contained in three files hosted in a S3 bucket. These three files are:

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
AWS_S3_BUCKET=
```

# How to run
Start express server
```shell script
$ npm start
```

main url `localhost:8080`

# How to use
`/users` support url query for filters, sort and limit with the following rules

Filter*
- `filter[field]`
    - `duration` filter by call's duration
        - `filter[value]` supports format '{number}(h|m|s)', for example 
            - `1h`: 1 hour
            - `2m`: 2 minutes
            - `30s`: 30 seconds
    - `startedAt` filter by call's startedAt time
        - `filter[value]` supports format 'YYYY-MM-DDTHH:mm:ss-{timeZone}', for example
            - `2017-12-14T16:34:10-10:00`
    
- `filter[operator]`
    - `gt` greater than
    - `gte` greater than or equal to
    - `eq` (default) equal to
    - `lte` less than or equal to
    - `lt` less than
    
- `filter[value]` 
    - varies by `filter[filed]`

Sort*

- `sort[type]`:
    - `count` (default): count of occurrence (could be conditional by filters)
    - `likelihood` ratio of occurrence / total (conditional by filters)
    
- `sort[order]`:
    - `desc` (default): descending order 
    - `asc` ascending order 

Limit*
- `limit` number of response result, default 10

Group*
- `group[type]`
    - `call` (default): group by call

### Example
Get 3 users who had most of less than 1 min calls

Request

`/users?filter[field]=duration&filter[value]=30m&filter[operator]=gt&sort[type]=count&limit=3`
  
Response
  
```json
[
    {
        "id": 18,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    },
    {
        "id": 69,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    },
    {
        "id": 98,
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "xxx@gmail.com"
    }
]
```

###### */teams not supported yet

# Task solution

## Task1
Which user(s) had the most calls?

Solution: query users by filters and sort
`/users?sort[type]=count&sort[order]=desc&limit=1`

## Task2
Which team conducted the least calls in March?

solution: query users by default query params  
`/teams`

## Task3
If a call duration under 2 minutes is an indicator of a problem with a call, which user is the most likely to have issues with their connection?

solution: query users by filters and sort  
`/users?filter[field]=duration&filter[value]=2m&filter[operator]=lt&sort[type]=likelihood&limit=1`

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
- `/teams` supports filter and sorting