// Main validation builder function
export { useValidator } from './validator-builder'
// Types
export type { RuleValidator, ValidationRule, Rules } from './types'
// Built-in Validation rules
export {
  betweenValues,
  containsDigit,
  containsLowerCase,
  containsSymbol,
  containsUpperCase,
  containsUpperOrLowerCase,
  decimal,
  emailAddress,
  integer,
  isAlpha,
  isAlphaNumeric,
  lengthBetween,
  maxLength,
  maxValue,
  minLength,
  minValue,
  numeric,
  required,
  sameAs,
} from './rules'
