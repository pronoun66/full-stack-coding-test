import { FilterField, FilterOperator, FilterTimeUnit } from '../const'

export interface Filter {
  field: FilterField;
  operator: FilterOperator;
  value: string;
}