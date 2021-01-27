import { Ref } from 'vue'
import {
  // IValidator,
  // IPropertyValidator,
  PropertyValidator,
  Validator,
  GroupValidator,
} from './Validator'
import { RuleValidator, ValidationRule, Rules, GroupRules } from './types'

export type { RuleValidator, ValidationRule, Rules, GroupRules } from './types'
export { useValidator } from './validator-factory'

/**
 * Creates a validation object for the supplied model based on the supplied rules
 *
 * @param model The model object to validate
 * @param rules The object that defines the validations for a model
 */
const useValidator = <T>(model: T, rules: Rules<T & { [key: string]: any }> | GroupRules<T>) => {
  // Get the property structure for the model
  const descriptors = Object.getOwnPropertyDescriptors(model)
  const modelKeys = Object.keys(descriptors)

  // Create a list of Validation rules
  const validationRules = new Array<ValidationRule<T>>()
  modelKeys.forEach(propertyName => {
    const pr = Object.getOwnPropertyDescriptor(rules, propertyName)?.value
    if (pr) {
      Object.keys(pr).forEach(ruleName => {
        const vr: ValidationRule<any> = { propertyName, ruleName, rule: pr[ruleName] }
        validationRules.push(vr)
      })
    }
  })
  // console.log(validationRules)

  // The master list of property validators
  const propertyValidators = modelKeys.map(key => {
    // Find the property's rule validator
    const rule = Object.getOwnPropertyDescriptor(rules, key)?.value as {
      [key: string]: RuleValidator<any>
    }
    // Create a new property validator
    const pv = new PropertyValidator(key, descriptors[key] as Ref<any>, rule, model)

    return pv
  })
  // console.log(propertyValidators)

  // Create a Groups object
  const groupObject = {}
  Object.keys(rules)
    .filter(key => {
      for (let i = 0; i < propertyValidators.length; i++) {
        const vr = propertyValidators[i]
        if (vr.PropertyName === key) {
          return false
        }
      }

      return true
    })
    .map(key => {
      return {
        groupName: key,
        propertyNames: Object.getOwnPropertyDescriptor(rules, key)?.value,
      }
    })
    // .filter(o => typeof o !== 'undefined')
    .forEach((gp: { groupName: string; propertyNames: string[] }) => {
      const vRules = new Array<PropertyValidator<any>>()
      gp.propertyNames.forEach((propertyName: string) => {
        const vr = propertyValidators.find(vr => vr.PropertyName === propertyName)
        if (vr) {
          vRules.push(vr)
        }
      })

      const group = Object.defineProperty(groupObject, gp.groupName, {
        value: new GroupValidator(vRules),
        enumerable: true,
        writable: false,
      })
    })
  // console.log('Group Object: ', groupObject)

  // Create the validation object and add the validation properties
  const v = new Validator(propertyValidators, groupObject)
  propertyValidators.forEach(pv => {
    // Add a property to the main validation object
    Object.defineProperty(v, pv.PropertyName, {
      configurable: false,
      enumerable: true,
      writable: false,
      value: pv,
    })
  })

  // type ValidatorType = IValidator<T, { [key: string]: GroupValidator }> &
  //   { [Key in keyof T]: IPropertyValidator<T[Key]> }

  // const ro = (v as unknown) as ValidatorType
  // console.log(ro.groups)
  return v as any
}
