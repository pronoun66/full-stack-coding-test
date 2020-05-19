import express from 'express'
import { getUsers, getTeams } from './apis'

const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/users', getUsers)
app.get('/teams', getTeams)

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})