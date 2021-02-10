import { Ref, ref, reactive, computed, watch, ReactiveEffect, UnwrapRef } from 'vue'
import {
  Rules,
  RuleValidator,
  ValidationRule,
  ValidationError,
  IPropertyValidator,
  PropertyRule,
  ValidationMessageContext,
  Validator,
  PropertyValidator,
} from './types'

/**
 * Creates a validator for the supplied using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
export const useValidator = <
  T extends { [key: string]: any },
  G extends { [key: string]: { [key in keyof T]?: true } }
>(
  model: T,
  rules: Rules<T & { [key: string]: any }>,
  groupDefinition?: G,
) => {
  // Create the empty root validator object
  const v = {}

  // Get the property structure for the model
  const descriptors = Object.getOwnPropertyDescriptors(model)
  const modelKeys = Object.keys(descriptors)

  // Create a list of Validation rules
  const validationRules = getValidationRules(modelKeys, rules)

  // Build the array of property rules
  const propertyRules = setPropertyRules(model, rules, descriptors, modelKeys)

  // Create the array of property validator objects
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
  if (groupDefinition !== void 0) {
    createGroupValidator(v, validatorProperties, groupDefinition)
  }

  // Strongly type the returned object
  return (reactive(v) as unknown) as Validator & // The root validator
    { [K in keyof T]: PropertyValidator<UnwrapRef<T[K]>> } & // The model property validators
    {
      [K2 in keyof G]: Validator & Record<keyof G[K2], PropertyValidator<UnwrapRef<any>>> // The group validators
    }
}

/******************************************
 *
 * Private builder methods
 *
 ******************************************/

const createGroupValidator = <T, G>(
  v: any,
  validatorProperties: IPropertyValidator<T>[],
  groupDefinition: G & { [key: string]: any },
) => {
  // Get the list of groups names
  // const groupKeys = Object.keys(rules).filter(rn => !modelKeys.some(mn => mn === rn))
  const groupKeys = Object.keys(groupDefinition)

  // Loop the group names and create their group validators
  groupKeys.forEach(groupName => {
    // Get the property names and their validators for this group property
    const groupPropertyNames = Object.keys(groupDefinition[groupName])
    const groupProperties: IPropertyValidator<T>[] = validatorProperties.filter(vp =>
      groupPropertyNames.some(gpn => gpn === vp._propertyName),
    )

    // This should be a Validator for the selected properties
    const gpv = createGroupPropertyValidator(groupProperties)

    groupProperties.forEach(gp => {
      Object.defineProperty(gpv, gp._propertyName, { value: gp, enumerable: true, configurable: true, writable: true })
    })

    // Add the group property with its group-validator to the root-validator
    Object.defineProperty(v, groupName, { value: gpv, enumerable: true, configurable: true, writable: true })
  })
}

// This creates the root validator property that represents a validation group
const createGroupPropertyValidator = <T>(validatorProperties: IPropertyValidator<T>[]) => {
  const errors = ref(new Array<ValidationError>())
  const isPending = ref(false)

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
    isPending.value = true
    errors.value.length = 0

    let isValid = true
    for (let i = 0; i < validatorProperties.length; i++) {
      const r = validatorProperties[i]

      if (!(await r.validate())) {
        isValid = false
        errors.value.push(...r.errors)
      }
    }

    isPending.value = false

    return isValid
  }

  return reactive({
    isPending: computed(() => isPending.value),
    isInvalid: computed(() => isInvalid.value),
    errors: computed(() => errors.value),
    hasErrors: computed(() => errors.value && errors.value.length > 0),
    validate,
  }) as Validator
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
        let message = r.rule.message
        if (typeof message === 'function') {
          const ctx: ValidationMessageContext = {
            value: model.value,
            propertyName,
            ruleName: r.ruleName,
            ...r.rule.params,
          }

          message = message(ctx)
        }

        errors.value.push({
          message,
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
  v: Validator & { [key: string]: IPropertyValidator<any> },
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

  Object.defineProperty(v, 'isPending', {
    value: isPending,
    enumerable: true,
    configurable: true,
    writable: true,
  })
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
  rules: Rules<T & { [key: string]: any }>,
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

const getValidationRules = <T, G>(modelKeys: string[], rules: Rules<T & { [key: string]: any }>) => {
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
