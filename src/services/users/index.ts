import { getCalls, getUsers } from '../../data'
import { Call } from '../../types'
import { ConditionTimeUnit, ConditionType, SortOrder, SortType, GroupType, timeUnitToMs } from '../../const'
import { IllegalArgumentError } from '../../errors/IllegalArgumentError'
import _ from 'lodash'

export const initialCallOptions = {
  group: {
    type: GroupType.CALL
  },
  condition: {
    type: ConditionType.NONE,
  },
  sort: {
    type: SortType.COUNT,
    order: SortOrder.DESC,
  },
  limit: 1
}

export const get = async (options: Options) => {

  const initialisedOptions = _.merge(initialCallOptions, options)

  if (initialisedOptions.group.type === GroupType.CALL) {
    return getGroupByCall(initialisedOptions)
  } else {
    throw new IllegalArgumentError('Unsupported Operations')
  }
}

export const getGroupByCall = async (
  options: Options) => {
  const {condition, sort, limit} = options

  const [calls, users] = await Promise.all([
    getCalls(),
    getUsers(),
  ])

  let conditionCriteria = 0
  if (condition.type === ConditionType.DURATION) {
    const {amount = 2, unit = ConditionTimeUnit.MINUTE} = condition
    conditionCriteria = amount * timeUnitToMs(unit)

  }

  // key is userId, value is {
  //    count: number of calls which meet the condition
  //    total: number of calls
  // }
  const userCounterMap = calls.reduce((acc: any, call: Call) => {
    const doesMeetCondition = condition.type === ConditionType.NONE
      ? true
      : call.duration < conditionCriteria // TODO condition operator

    call.participants.forEach(({userId}) => {
      const {count, total} = acc[userId] || {count: 0, total: 0}
      acc[userId] = {
        count: count + (doesMeetCondition ? 1 : 0),
        total: total + 1
      }
    })
    return acc
  }, {}) as { [key: string]: { count: number, total: number } }

  return Object.entries(userCounterMap)
    .sort(([, counterA], [, counterB]) => {
      let valueA, valueB

      if (sort.type === SortType.COUNT) {
        valueA = counterA.count
        valueB = counterB.count
      } else { // likelihood
        valueA = counterA.count / (counterA.total || 1)
        valueB = counterB.count / (counterB.total || 1)
      }

      if (sort.order === SortOrder.DESC) {
        return valueA < valueB ? 1 : -1
      }

      return valueA < valueB ? -1 : 1
    })
    .slice(0, limit)
    .map(([key,]) => users.find(({id}) => id.toString() === key))
}


interface Options {
  group?: {
    type: GroupType
  }
  condition?: {
    type: ConditionType
    unit?: ConditionTimeUnit,
    amount?: number
  }
  sort?: {
    type: SortType
    order: SortOrder,
  },
  limit?: number
}