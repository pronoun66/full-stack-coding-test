import _ from 'lodash'
import { getCalls, getUsers } from '../../data'
import { Call } from '../../types'
import { FilterTimeUnit, FilterType, SortOrder, SortType, GroupType, timeUnitToMs } from '../../const'
import { IllegalArgumentError } from '../../errors/IllegalArgumentError'

export const initialCallOptions = {
  group: {
    type: GroupType.CALL
  },
  filter: {
    type: FilterType.NONE,
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

// TODO Function can be separated by filter and sorting
export const getGroupByCall = async (
  options: Options) => {
  const {filter, sort, limit} = options

  const [calls, users] = await Promise.all([
    getCalls(),
    getUsers(),
  ])

  let filterCriteria = 0
  if (filter.type === FilterType.DURATION) {
    const {amount = 2, unit = FilterTimeUnit.MINUTE} = filter
    filterCriteria = amount * timeUnitToMs(unit)

  }

  // key is userId, value is {
  //    count: number of calls which meet the filter
  //    total: number of calls
  // }
  const userCounterMap = calls.reduce((acc: any, call: Call) => {
    const doesMeetCriteria = filter.type === FilterType.NONE
      ? true
      : call.duration < filterCriteria // TODO filter operator

    call.participants.forEach(({userId}) => {
      const {count, total} = acc[userId] || {count: 0, total: 0}
      acc[userId] = {
        count: count + (doesMeetCriteria ? 1 : 0),
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
    .map(([key,]) => users.find(({id}) => id.toString() === key))
}


interface Options {
  group?: {
    type: GroupType;
  };
  filter?: {
    type: FilterType;
    unit?: FilterTimeUnit;
    amount?: number;
  };
  sort?: {
    type: SortType;
    order: SortOrder;
  };
  limit?: number;
}