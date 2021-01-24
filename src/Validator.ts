import { ListFormat } from 'typescript'
import { ref, Ref } from 'vue'
import { RuleValidator, ValidationError } from './types'

/*******************************************
 *
 * Public interfaces
 *
 *******************************************/

interface IRootValidator {
  /**
   * Gets a value indicating if the validator is in an invalid state after the last validation
   */
  readonly isInvalid: Ref<boolean>
  /**
   * Gets a list of errors from the last validation
   */
  readonly errors: Array<ValidationError>
  /**
   * Gets a value indicating if there are errors
   */
  readonly hasErrors: Ref<boolean>
  /**
   * Trigger a validation
   *
   * @returns (async) true, if validation succeeds
   */
  validate(): Promise<boolean>
}

/**
 * The interface for the root validator
 */
export interface IValidator<T, G> extends IRootValidator {
  /**
   * An object containing any validation groups
   */
  readonly groups: G
}

/**
 * The public interface of a validator object
 */
export interface IPropertyValidator<T> extends IRootValidator {
  /**
   * Gets a value indicating if the validator has had its model value set
   */
  readonly isDirty: Ref<boolean>
  /**
   * The validator's model (for binding purposes)
   */
  readonly model: T
}

/*****************************************
 *
 * Validation classes
 *
 *****************************************/

/**
 * The implementation of the root validator object
 */
export class Validator<T, G> implements IValidator<T, G> {
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _groups: G
  private _validators: Array<PropertyValidator<any, any>>

  constructor(validators: Array<PropertyValidator<any, any>>, groupObject: G) {
    this._validators = validators
    this._groups = groupObject
  }

  public get isInvalid() {
    return this._isInvalid
  }

  public get errors() {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public get groups() {
    return this._groups
  }

  public async validate(): Promise<boolean> {
    this._errors.length = 0

    if (!this._validators) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true

    for (let i = 0; i < this._validators.length; i++) {
      const element = this._validators[i]

      if (!(await element.validate())) {
        isValid = false
        this._errors.push(...element.errors)
      }
    }

    this._isInvalid.value = !isValid
    this._hasErrors.value = this.errors.length > 0

    return Promise.resolve(isValid)
  }
}

/**
 * The implementation of a property validator
 */
export class PropertyValidator<T extends Ref, M> implements IPropertyValidator<T> {
  private _isDirty = ref(false)
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _proxy: any
  private _lastValue?: T
  private _propertyName: string
  private _rules: { [key: string]: RuleValidator<T> }
  private _model: M

  constructor(
    propertyName: string,
    propertyModel: T,
    rules: { [key: string]: RuleValidator<T> },
    model: M,
  ) {
    this._model = model
    this._propertyName = propertyName
    this._rules = rules

    const self = this
    this._proxy = new Proxy(propertyModel, {
      set: function (target, prop, value, receiver) {
        // console.log('Proxy.set:', value)

        // Default behavior
        target.value = value
        // Fire the hook for validation
        self.setPropertyValue(value)
        // Return success in the process
        return true
      },
    })
  }

  private setPropertyValue(newValue: T) {
    if (newValue !== this._lastValue) {
      this._lastValue = newValue
      this._isDirty.value = true
      this.validate()
    }
  }

  public get PropertyName() {
    return this._propertyName
  }

  public get isDirty() {
    return this._isDirty
  }

  public get isInvalid() {
    return this._isInvalid
  }

  public get errors() {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public get model() {
    return this._proxy
  }

  public async validate() {
    this._errors.length = 0

    if (!this._rules) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true
    const keys = Object.keys(this._rules)
    for (let i = 0; i < keys.length; i++) {
      const validator = this._rules[keys[i]]

      if (!(await validator.validator(this.model.value, this._model))) {
        isValid = false
        this._errors.push({
          message: validator.message,
          propertyName: this._propertyName,
          ruleName: validator.ruleName,
          toString() {
            return this.message
          },
        } as ValidationError)
      }
    }

    this._isInvalid.value = !isValid
    this._hasErrors.value = this._errors.length > 0

    return Promise.resolve(isValid)
  }
}

export class GroupValidator implements IRootValidator {
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _propertyValidators: PropertyValidator<any, any>[]

  constructor(propertyValidators: PropertyValidator<any, any>[]) {
    this._propertyValidators = propertyValidators
  }

  public get isInvalid() {
    return this._isInvalid
  }

  public get errors() {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public async validate(): Promise<boolean> {
    this._errors.length = 0

    if (!this._propertyValidators) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true

    for (let j = 0; j < this._propertyValidators.length; j++) {
      const pv = this._propertyValidators[j]

      if (!(await pv.validate())) {
        isValid = false
        this._errors.push(...pv.errors)
      }
    }

    this._isInvalid.value = !isValid
    this._hasErrors.value = this._errors.length > 0

    return Promise.resolve(isValid)
  }
}
