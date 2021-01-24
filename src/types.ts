import { Ref } from 'vue'

/**
 * The signature of a validation function: `async` function that takes a value and validates it
 */
export type ValidationFunction<T> = (
  value: T | Ref<T>,
  context?: { [key: string]: any },
) => Promise<Boolean>

/**
 * The definition of a validation rule object
 */
export type RuleValidator<T> = {
  /**
   * The name of the validation rule
   */
  ruleName: string
  /**
   * The actual function that perform the validation
   */
  validator: ValidationFunction<T>
  /**
   * The error message template for when validation fails
   */
  message: string
  /**
   * Any parameters needed for the validation rule
   */
  params?: any[]
}

/**
 * Represents a validation error
 */
export type ValidationError = {
  readonly propertyName: string
  readonly ruleName: string
  readonly message: string
}

/**
 * Represents the details of a validation rule
 */
export type ValidationRule<T> = {
  propertyName: string
  ruleName: string
  rule: any
}
