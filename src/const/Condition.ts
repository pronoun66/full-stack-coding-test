export enum ConditionType {
  DURATION = 'duration',
  NONE = 'none'
}

export enum ConditionTimeUnit {
  MINUTE = 'minute',
  HOUR = 'hour'
}

export const timeUnitToMs = (unit: ConditionTimeUnit) => {
  switch (unit) {
    case ConditionTimeUnit.MINUTE:
      return 60000
    case ConditionTimeUnit.HOUR:
      return 3600000
    default:
      return 60000
  }
}