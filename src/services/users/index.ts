import _ from 'lodash'
import { getCalls, getUsers } from '../../data'
import { Call, Filter } from '../../types'
import { FilterField, FilterOperator, FilterTimeUnit, GroupType, SortOrder, SortType } from '../../const'
import { getFilterComparator } from '../../utils/filter'
import { IllegalArgumentError } from '../../errors/IllegalArgumentError'

export const initialCallOptions = {
  group: {
    type: GroupType.CALL
  },
  sort: {
    type: SortType.COUNT,
    order: SortOrder.DESC,
  },
  limit: 10
}

export const get = async (options: Options) => {

  const initialisedOptions = _.merge(initialCallOptions, options)

  if (initialisedOptions.group.type === GroupType.CALL) {
    return getGroupByCall(initialisedOptions)
  } else {
    throw new IllegalArgumentError('Unsupported Operations')
  }
}

// TODO Function can be separated by filter and sorting
export const getGroupByCall = async (options: Options) => {
  const {filter, sort, limit} = options

  const [calls, users] = await Promise.all([
    getCalls(),
    getUsers(),
  ])

  const filterComparator = getFilterComparator(filter) as any

  // key is userId, value is {
  //    count: number of calls which meet the filter
  //    total: number of calls
  // }
  const userCounterMap = calls.reduce((acc: any, call: Call) => {
    const isMatch = filterComparator(call)

    call.participants.forEach(({userId}) => {
      const {count, total} = acc[userId] || {count: 0, total: 0}
      acc[userId] = {
        count: count + (isMatch ? 1 : 0),
        total: total + 1
      }
    })
    return acc
  }, {}) as { [key: string]: { count: number; total: number } }

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
    .map(([key,]) => {
      const user = users.find(({id}) => id.toString() === key)
      return user ? user : {id: parseInt(key)}
    })
}


interface Options {
  group?: {
    type: GroupType;
  };
  filter?: Filter;
  sort?: {
    type: SortType;
    order: SortOrder;
  };
  limit?: number;
}