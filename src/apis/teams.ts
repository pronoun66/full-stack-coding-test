import { NextFunction, Request, Response } from 'express'
import { get } from '../services/teams'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'


export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query

  try {
    const users = await get(query)
    res.send(users)
  } catch (e) {
    if (e instanceof IllegalArgumentError) {
      res.status(400).send({
        message: e.message
      })
      return
    }
    throw e
  }
}