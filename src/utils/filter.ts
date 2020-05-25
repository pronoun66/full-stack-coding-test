import { FilterField, FilterOperator, FilterTimeUnit } from '../const'
import { Filter } from '../types'
import { IllegalArgumentError } from '../errors/IllegalArgumentError'
import moment from 'moment'

const comparator = (field: FilterField, criteria: number, operator: FilterOperator) => (obj: any) => {
  const value = obj[field]

  switch (operator) {
    case FilterOperator.GT:
      return value > criteria
    case FilterOperator.GTE:
      return value >= criteria
    case FilterOperator.EQ:
      return value === criteria
    case FilterOperator.LTE:
      return value <= criteria
    case FilterOperator.LT:
      return value < criteria
    default:
      throw new IllegalArgumentError('Invalid filterOperator')
  }
}

const timeComparator = (field: FilterField, criteria: string, operator: FilterOperator) => (obj: any) => {
  const criteriaTime = moment(criteria)
  const valueTime = moment(obj[field])

  switch (operator) {
    case FilterOperator.GT:
      return valueTime.isAfter(criteriaTime)
    case FilterOperator.GTE:
      return valueTime.isSameOrAfter(criteriaTime)
    case FilterOperator.EQ:
      return valueTime.isSame(criteriaTime)
    case FilterOperator.LTE:
      return valueTime.isSameOrBefore(criteriaTime)
    case FilterOperator.LT:
      return valueTime.isBefore(criteriaTime)
    default:
      throw new IllegalArgumentError('Invalid filterOperator')
  }
}

const timeUnitToMs = (unit: FilterTimeUnit) => {
  switch (unit) {
    case FilterTimeUnit.SECOND:
      return 1000
    case FilterTimeUnit.MINUTE:
      return 60000
    case FilterTimeUnit.HOUR:
      return 3600000
    default:
      throw new Error('Invalid time unit')
  }
}

export const getFilterComparator = (filter: Filter) => {
  if (!filter) {
    return () => true
  }

  if (filter.field === FilterField.DURATION) {
    const {value = '', operator = FilterOperator.EQ} = filter
    const match = value.match(/(\d+)(h|m|s)+/)
    if (!match) {
      throw new IllegalArgumentError('Invalid filter value')
    }
    const amount = parseInt(match[1])
    const unit = match[2] as FilterTimeUnit
    const filterCriteria = amount * timeUnitToMs(unit)
    return comparator(FilterField.DURATION, filterCriteria, operator)
  }

  if (filter.field === FilterField.STARTED_AT) {
    const {value = '', operator = FilterOperator.EQ} = filter
    return timeComparator(FilterField.STARTED_AT, value, operator)
  }

  throw new IllegalArgumentError('Unsupported field')
}