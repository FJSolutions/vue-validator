import { Ref, isRef } from 'vue'
import { RuleValidator } from './types'

/****************************************
 *
 * String Rule validators
 *
 ****************************************/

const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

export const required = {
  ruleName: 'required',
  message: 'Some text is required',
  validator: value => {
    const rawValue = isRef(value) ? (value.value as string) : value
    return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length > 0)
  },
} as RuleValidator<string | Ref<string>>

export const minLength = (min: number) => {
  return {
    ruleName: 'minimum length',
    message: `The text must be at least ${min} letters long`,
    params: [min],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as string) : value
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min)
    },
  } as RuleValidator<string | Ref<string>>
}

export const maxLength = (max: number) => {
  return {
    ruleName: 'maximum length',
    message: `The text must not be longer than ${max} letters long`,
    params: [max],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as string) : value
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length <= max)
    },
  } as RuleValidator<string | Ref<string>>
}

export const lengthBetween = (min: number, max: number) => {
  return {
    ruleName: 'length between',
    message: `The text must be between ${min} and ${max} letters long`,
    params: [min, max],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as string) : value
      return Promise.resolve(
        typeof rawValue !== 'undefined' && rawValue.length >= min && rawValue.length <= max,
      )
    },
  } as RuleValidator<string | Ref<string>>
}

export const emailAddress = {
  ruleName: 'email address',
  message: 'The text does not appear to be a valid email address',
  validator: value => {
    const rawValue = isRef(value) ? (value.value as string) : value
    return Promise.resolve(emailRegex.test(rawValue))
  },
} as RuleValidator<string | Ref<string>>

export const sameAs = (propertyName: string) => {
  return {
    ruleName: 'same as',
    message: `The text is not the same as ${propertyName}`,
    params: [propertyName],
    validator: (value, context) => {
      const otherValue = isRef(context?.[propertyName])
        ? context?.[propertyName].value
        : context?.[propertyName]
      const rawValue = isRef(value) ? (value.value as string) : value
      // console.log('sameAs()', rawValue, otherValue)

      return Promise.resolve(rawValue === otherValue)
    },
  } as RuleValidator<string | Ref<string>>
}

/***************************************************
 *
 * Numeric Rule Validators
 *
 **************************************************/

const intRegex = /(^[0-9]*$)|(^-[0-9]+$)/

export const integer = {
  ruleName: 'email address',
  message: 'The number does not appear to be a valid integer',
  validator: value => {
    const rawValue = String(isRef(value) ? (value.value as number) : value)
    return Promise.resolve(intRegex.test(rawValue))
  },
} as RuleValidator<number | Ref<number>>

export const minValue = (min: number) => {
  return {
    ruleName: 'minimum value',
    message: `The number must be at least ${min}`,
    params: [min],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as number) : value
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min)
    },
  } as RuleValidator<number | Ref<number>>
}

export const maxValue = (max: number) => {
  return {
    ruleName: 'maximum value',
    message: `The number must be at less than ${max}`,
    params: [max],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as number) : value
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue <= max)
    },
  } as RuleValidator<number | Ref<number>>
}

export const betweenValues = (min: number, max: number) => {
  return {
    ruleName: 'maximum value',
    message: `The number must be between ${min} and ${max}`,
    params: [min, max],
    validator: value => {
      const rawValue = isRef(value) ? (value.value as number) : value
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min && rawValue <= max)
    },
  } as RuleValidator<number | Ref<number>>
}
