import { Ref } from 'vue'
import { GroupRules, Rules, RuleValidator, ValidationRule } from './types'
import { PropertyValidator } from './Validator'

export const useValidator = <T>(
  model: T,
  rules: Rules<T & { [key: string]: any }> | GroupRules<T>,
) => {
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
}
