/**
 * The type definition of an object that defines the validation riles for a type
 */
export type Rules<T> = { [Key in keyof T]?: { [key: string]: RuleValidator<T[Key]> } }

/**
 * The type definition of a group of validation rules for a type
 */
export type GroupRules<T, G> =
  | {
      [Key in keyof T]?: { [validatorName: string]: RuleValidator<T[Key]> }
    }
  | {
      [Key in keyof G]: (keyof T)[]
    }

/**
 * The signature of a validation function: `async` function that takes a value and validates it
 */
export type ValidationFunction<T> = (value: any, context?: { [key: string]: any }) => Promise<Boolean>

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
  rule: RuleValidator<T>
}

/**
 * Represents the details of model property's rule information
 */
export type PropertyRule<T> = {
  propertyName: string
  propertyModel: T
  rules: { [key: string]: RuleValidator<T> }
  validationModel: any
}

/*******************************************
 *
 * Public interfaces
 *
 *******************************************/

/**
 * The interface for the root validator
 */
export interface IValidator {
  /**
   * Gets a value indicating if the validator is in an invalid state after the last validation
   */
  readonly isInvalid: boolean
  /**
   * Gets a list of errors from the last validation
   */
  readonly errors: Array<ValidationError>
  /**
   * Gets a value indicating if there are errors
   */
  readonly hasErrors: boolean
  /**
   * Trigger a validation
   *
   * @returns (async) true, if validation succeeds
   */
  validate(): Promise<boolean>
}

/**
 * The public interface of a validator object
 */
export interface IPropertyValidator<T> extends IValidator {
  /**
   * Gets a value indicating if the validator has had its model value set
   */
  readonly isDirty: boolean
  /**
   * The model object that is being validated
   */
  model: T
}
