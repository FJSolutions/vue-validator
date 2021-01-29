import { Ref, ref, reactive, computed, watch, ReactiveEffect } from 'vue'
import {
  GroupRules,
  Rules,
  RuleValidator,
  ValidationRule,
  ValidationError,
  IValidator,
  IPropertyValidator,
  PropertyRule,
} from './types'

/**
 * Wraps making a valid Rules configuration object byt supply ig type information as type parameters to this constructor function
 *
 * @param validationDefinition An object literal that confirms to a validation configuration interface
 */
export const useRulesConstructor = <T, G>(
  validationDefinition: { [Key1 in keyof T]?: { [validatorName: string]: RuleValidator<T[Key1]> } } &
    // & { [groupName: string]: (keyof T)[]}
    { [Key2 in keyof G]: (keyof T)[] },
) => {
  return validationDefinition
}

/**
 * Creates a validator for the supplied using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
export const useValidator = <T extends { [key: string]: any }, G = {}>(
  model: T,
  rules: Rules<T & { [key: string]: any }> | GroupRules<T, G>,
) => {
  // Get the property structure for the model
  const descriptors = Object.getOwnPropertyDescriptors(model)
  const modelKeys = Object.keys(descriptors)
  const v = {}

  // Create a list of Validation rules
  const validationRules = getValidationRules(modelKeys, rules)

  // The master list of property validators
  const propertyRules = setPropertyRules(model, rules, descriptors, modelKeys)

  // Create the list properties as validator objects
  const validatorProperties = propertyRules.map(pv => {
    // Get the rules for this property
    const propertyRules = validationRules.filter(r => r.propertyName === pv.propertyName)

    // Create the property validator instance
    const po = createPropertyValidator(model, propertyRules, pv.propertyName)

    Object.defineProperty(v, pv.propertyName, { value: po, enumerable: true, configurable: true, writable: true })

    return po
  })

  // Create the root validator
  createValidator(v as any, propertyRules, validatorProperties)

  // Create group validator
  createGroupValidator(v, rules, modelKeys, validatorProperties as any)

  // Return a strongly typed validator for this configuration
  return (reactive(v) as unknown) as IValidator & // A validator
    // A property from the model with a validator
    { [Key in keyof T]: IPropertyValidator<T[Key] extends Ref<infer R> ? R : T[Key]> } &
    // Group object properties that exposer validators
    {
      // Interface for Interface for the core validator & the validator properties in this group
      [key in keyof G]: IValidator & { [key: string]: IValidator }
    }
}

/******************************************
 *
 * Private builder methods
 *
 ******************************************/

const createGroupValidator = <T>(
  v: any,
  rules: { [key: string]: any },
  modelKeys: string[],
  validatorProperties: (IPropertyValidator<T> & { _propertyName: string })[],
) => {
  // Get the list of groups names
  const groupKeys = Object.keys(rules).filter(rn => !modelKeys.some(mn => mn === rn))

  // Loop the group names and create their group validators
  groupKeys.forEach(gn => {
    const groupProperties: (IPropertyValidator<T> & { _propertyName: string })[] = (rules[gn] as string[]).map(
      gpn => validatorProperties.find(vp => vp._propertyName === gpn)!,
    )

    // This should be an IValidator for the selected properties
    const gpv = createGroupPropertyValidator(groupProperties)

    groupProperties.forEach(gp => {
      Object.defineProperty(gpv, gp._propertyName, { value: gp, enumerable: true, configurable: true, writable: true })
    })

    // Add the group property with its group-validator to the root-validator
    Object.defineProperty(v, gn, { value: gpv, enumerable: true, configurable: true, writable: true })
  })
}

const createGroupPropertyValidator = <T>(validatorProperties: IPropertyValidator<T>[]) => {
  const errors = ref(new Array<ValidationError>())

  const isInvalid = computed(() => {
    let i = 0
    let isValid = true
    while (i < validatorProperties.length) {
      const vp = validatorProperties[i]
      if (vp.isInvalid) {
        isValid = false
        break
      }
      i += 1
    }

    return !isValid
  })

  const validate = async () => {
    errors.value.length = 0

    let isValid = true
    for (let i = 0; i < validatorProperties.length; i++) {
      const r = validatorProperties[i]

      if (!(await r.validate())) {
        isValid = false
        errors.value.push(...r.errors)
      }
    }

    return isValid
  }

  return reactive({
    isInvalid,
    errors,
    hasErrors: computed(() => errors.value && errors.value.length > 0),
    validate,
  }) as IValidator
}

const createPropertyValidator = <T extends { [key: string]: any }>(
  context: T,
  rules: ValidationRule<any>[],
  propertyName: string,
) => {
  const isDirty = ref(false)
  const isPending = ref(false)
  const errors = ref(new Array<ValidationError>())
  const model: Ref<any> = context[propertyName]
  const isInvalid = ref(false)

  // console.log('PropertyValidator.model', context[propertyName])

  // Watch for changes to the model
  watch(
    model,
    async (value, oldValue) => {
      isDirty.value = true
      await validate()
    },
    { flush: 'sync' },
  )

  // Validate all the rules for this property
  const validate = async () => {
    isPending.value = true
    errors.value.length = 0

    let isValid = true
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i]

      if (!(await r.rule.validator(model.value, context))) {
        isValid = false
        errors.value.push({
          message: r.rule.message,
          propertyName: propertyName,
          ruleName: r.ruleName,
          toString() {
            return this.message
          },
        } as ValidationError)
      }
    }

    isInvalid.value = !isValid
    isPending.value = false

    return isValid
  }

  return reactive({
    _propertyName: propertyName,
    isDirty: computed(() => isDirty.value),
    isPending: computed(() => isPending.value),
    hasErrors: computed(() => errors.value && errors.value.length > 0),
    errors: computed(() => errors.value),
    isInvalid: computed(() => isInvalid.value),
    model,
    validate,
  }) as IPropertyValidator<any>
}

const createValidator = (
  v: IValidator & { [key: string]: IPropertyValidator<any> },
  propertyRules: PropertyRule<any>[],
  validatorProperties: IPropertyValidator<any>[],
) => {
  const isPending = ref(false)
  const errors = ref(new Array<ValidationError>())

  const hasErrors = computed(() => errors.value && errors.value.length > 0)
  const isInvalid = computed(() => {
    let i = 0
    let isValid = true
    while (i < validatorProperties.length) {
      const vp = validatorProperties[i]
      if (!vp.isInvalid) {
        isValid = false
        break
      }
      i += 1
    }

    return isValid
  })

  const validate = async () => {
    isPending.value = true
    errors.value.length = 0

    // Loop all the properties and validate them
    let isValid = true
    for (let i = 0; i < propertyRules.length; i++) {
      const pr = propertyRules[i]
      const property = v[pr.propertyName]

      if (!(await property.validate())) {
        isValid = false
        errors.value.push(...property.errors)
      }
    }

    isPending.value = false

    return isValid
  }

  Object.defineProperty(v, 'isInvalid', {
    value: isInvalid,
    enumerable: true,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(v, 'errors', {
    value: computed(() => errors.value),
    enumerable: true,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(v, 'hasErrors', { value: hasErrors, enumerable: true, configurable: true, writable: true })
  Object.defineProperty(v, 'validate', { value: validate, enumerable: true, configurable: true, writable: true })
}

const setPropertyRules = <T, G>(
  model: T,
  rules: Rules<T & { [key: string]: any }> | GroupRules<T, G>,
  descriptors: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & {
    [key: string]: PropertyDescriptor
  },
  modelKeys: string[],
) => {
  const propertyValidators = modelKeys.map(key => {
    // Find the property's rule validator
    const ruleObj = Object.getOwnPropertyDescriptor(rules, key)?.value as {
      [key: string]: RuleValidator<any>
    }
    // Create a new property validator
    const pv: PropertyRule<any> = {
      propertyName: key,
      propertyModel: descriptors[key] as Ref<any>,
      rules: ruleObj,
      validationModel: model,
    }

    return pv
  })

  return propertyValidators
}

const getValidationRules = <T, G>(modelKeys: string[], rules: Rules<T & { [key: string]: any }> | GroupRules<T, G>) => {
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

  return validationRules
}
