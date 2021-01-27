import { ListFormat } from 'typescript'
import { ref, Ref } from 'vue'
import { IPropertyValidator, IBaseValidator, IValidator, RuleValidator, ValidationError } from './types'

/*****************************************
 *
 * Validation classes
 *
 *****************************************/

/**
 * The implementation of the root validator object
 */
export class Validator<T> implements IValidator<T> {
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _groups: any
  private _validators: Array<PropertyValidator<any>>

  constructor(validators: Array<PropertyValidator<any>>, groupObject: any) {
    this._validators = validators
    this._groups = groupObject
  }

  public get isInvalid() {
    return this._isInvalid
  }

  public get errors(): any {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public get groups(): any {
    return this._groups
  }

  public get model(): any {
    throw new Error('Not implemented!')
  }

  public async validate(): Promise<boolean> {
    this._errors.length = 0

    if (!this._validators) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true

    for (let i = 0; i < this._validators.length; i++) {
      const propertyValidator = this._validators[i]

      if (!(await propertyValidator.validate(false))) {
        isValid = false
        this._errors.push(...propertyValidator.errors)
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
export class PropertyValidator<T extends Ref> implements IPropertyValidator<T> {
  private _isDirty = ref(false)
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _proxy: any
  private _lastValue?: any
  private _propertyName: string
  private _rules: { [key: string]: RuleValidator<T> }
  private _model: any

  constructor(propertyName: string, propertyModel: T, rules: { [key: string]: RuleValidator<T> }, model: any) {
    this._model = model
    this._propertyName = propertyName
    this._rules = rules

    const self = this
    this._proxy = new Proxy(propertyModel, {
      get: function (target, prop, receiver) {
        return target.value
      },
      set: function (target, prop, value, receiver) {
        // NB: This ALWAYS comes through as a string from a control!
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

  private setPropertyValue(newValue: any) {
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

  public get errors(): any {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public get model() {
    return this._proxy
  }

  public async validate(skipDirty = true) {
    if (!skipDirty && this._isDirty.value) {
      return Promise.resolve(!this._isInvalid.value)
    }

    this._errors.length = 0

    if (!this._rules) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true
    const keys = Object.keys(this._rules)
    for (let i = 0; i < keys.length; i++) {
      const validator = this._rules[keys[i]]

      if (!(await validator.validator(this._proxy.value, this._model))) {
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

export class GroupValidator<T> implements IBaseValidator {
  private _isInvalid = ref(false)
  private _hasErrors = ref(false)
  private _errors = new Array<ValidationError>()
  private _propertyValidators: PropertyValidator<any>[]

  constructor(propertyValidators: PropertyValidator<any>[]) {
    this._propertyValidators = propertyValidators
  }

  public get isInvalid() {
    return this._isInvalid
  }

  public get errors(): any {
    return this._errors
  }

  public get hasErrors() {
    return this._hasErrors
  }

  public get model(): any {
    throw new Error('Not implemented!')
  }

  public async validate(): Promise<boolean> {
    this._errors.length = 0

    if (!this._propertyValidators) {
      this._isInvalid.value = false
      return Promise.resolve(true)
    }

    let isValid = true

    for (let j = 0; j < this._propertyValidators.length; j++) {
      const propertyValidator = this._propertyValidators[j]

      if (!(await propertyValidator.validate(false))) {
        isValid = false
        this._errors.push(...propertyValidator.errors)
      }
    }

    this._isInvalid.value = !isValid
    this._hasErrors.value = this._errors.length > 0

    return Promise.resolve(isValid)
  }
}
