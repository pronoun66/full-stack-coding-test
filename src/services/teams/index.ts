import { getCalls, getTeams } from '../../data'
import moment from 'moment'
import { Call } from 'Call'


export const get = async ({limit = 1, callInMonth = 2} = {}) => {
  const [calls, teams] = await Promise.all([
    getCalls(),
    getTeams(),
  ])

  const sortedMarchCalls = calls.filter((call: Call) => {
    const time = moment(call.startedAt)
    return time.month() === callInMonth
  })
    .sort((callA: Call, callB: Call) => {
      const timeA = moment(callA.startedAt)
      const timeB = moment(callB.startedAt)
      return timeA.isBefore(timeB) ? 1 : -1
    })

  return sortedMarchCalls
    .slice(0, limit)
    .map((call: Call) => teams.find(({id}) => id === call.teamId))
}