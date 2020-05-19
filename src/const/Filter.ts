export enum FilterType {
  DURATION = 'duration',
  NONE = 'none'
}

export enum FilterTimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour'
}

export enum FilterOperator {
  GTE = 'gte',
  GT = 'gt',
  EQUAL = 'equal',
  LTE = 'lte',
  LT = 'lt'
}

export const timeUnitToMs = (unit: FilterTimeUnit) => {
  switch (unit) {
    case FilterTimeUnit.SECOND:
      return 1000
    case FilterTimeUnit.MINUTE:
      return 60000
    case FilterTimeUnit.HOUR:
      return 3600000
    default:
      return 60000
  }
}