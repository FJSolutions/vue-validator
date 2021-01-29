import { createLogicalAnd } from 'typescript'
import { Ref, isRef } from 'vue'
import { unwrap } from './helpers'
import { RuleValidator } from './types'

/*****************************************
 *
 * Helper functions
 *
 ****************************************/

export const containsLowerCase = (value: string, numberOfOccurrences = 1) => {
  if (!value) {
    return false
  }

  let count = 0
  for (let i = 0; i < value.length; i++) {
    if (count >= numberOfOccurrences) return true

    const c = value.charAt(i)
    if (c == c.toLocaleLowerCase()) {
      count += 1
    }
  }

  if (count >= numberOfOccurrences) return true

  return false
}

export const containsUpperCase = (value: string, numberOfOccurrences = 1) => {
  if (!value) {
    return false
  }

  let count = 0
  for (let i = 0; i < value.length; i++) {
    if (count >= numberOfOccurrences) return true
    const c = value.charAt(i)
    if (c == c.toLocaleUpperCase()) {
      count += 1
    }
  }

  if (count >= numberOfOccurrences) return true

  return false
}

export const containsUpperOrLowerCase = (value: string, numberOfOccurrences = 1) => {
  if (!value) {
    return false
  }

  let count = 0
  for (let i = 0; i < value.length; i++) {
    if (count >= numberOfOccurrences) return true
    const c = value.charAt(i)
    if (c == c.toLocaleUpperCase()) {
      count += 1
    } else if (c == c.toLocaleUpperCase()) {
      count += 1
    }
  }

  if (count >= numberOfOccurrences) return true

  return false
}

export const containsDigit = (value: string, numberOfOccurrences = 1) => {
  if (!value) {
    return false
  }

  let count = 0
  for (let i = 0; i < value.length; i++) {
    if (count >= numberOfOccurrences) return true

    const c = value.charAt(i)
    if (c >= '0' && c <= '9') {
      count += 1
    }
  }

  if (count >= numberOfOccurrences) return true

  return false
}

export const containsSymbol = (
  value: string,
  numberOfOccurrences: number = 1,
  symbols: string[] = [
    '~',
    '`',
    '!',
    ' ',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '-',
    '+',
    '=',
    '{',
    '[',
    '}',
    ']',
    '|',
    "'",
    ':',
    ';',
    '"',
    ',',
    '<',
    ',',
    '>',
    '.',
    '?',
    '/',
  ],
) => {
  if (!value) {
    return false
  }

  let count = 0
  for (let i = 0; i < value.length; i++) {
    if (count >= numberOfOccurrences) return true

    const c = value.charAt(i)
    if (symbols.some(s => s === c)) {
      count += 1
    }
  }

  if (count >= numberOfOccurrences) return true

  return false
}

/****************************************
 *
 * String Rule validators
 *
 ****************************************/

const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
const alphaRegex = /(?:^[a-zA-Z]+$)/
const alphaNumericRegex = /(?:^[a-zA-Z0-9]+)$/

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
      return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min && rawValue.length <= max)
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
      const otherValue = unwrap(context?.[propertyName])
      const rawValue = unwrap(value)
      // console.log('sameAs()', rawValue, otherValue)

      return Promise.resolve(rawValue === otherValue)
    },
  } as RuleValidator<string | Ref<string>>
}

export const isAlpha = {
  ruleName: 'same as',
  message: `The text contains non-alphabetic letters`,
  params: [],
  validator: (value: string) => {
    const rawValue = String(value) || ''

    let isValid = true
    for (let i = 0; i < rawValue.length; i++) {
      const c = rawValue[i]

      if (c >= 'a' && c <= 'z') {
        continue
      } else if (c >= 'A' && c <= 'Z') {
        continue
      }

      // console.log(c)

      isValid = false
      break
    }

    return Promise.resolve(isValid)
  },
} as RuleValidator<string | Ref<string>>

export const isAlphaNumeric = {
  ruleName: 'same as',
  message: `The text contains non-alphabetic letters`,
  params: [],
  validator: value => {
    const rawValue = String(isRef(value) ? (value.value as string) : value) || ''

    let isValid = true
    for (let i = 0; i < rawValue.length; i++) {
      const c = rawValue[i]

      if (c >= 'a' && c <= 'z') {
        continue
      } else if (c >= 'A' && c <= 'Z') {
        continue
      } else if (c >= '0' && c <= '9') {
        continue
      }

      // console.log(c)

      isValid = false
      break
    }

    return Promise.resolve(isValid)
  },
} as RuleValidator<string | Ref<string>>

/***************************************************
 *
 * Numeric Rule Validators
 *
 **************************************************/

const intRegex = /(?:^[-+]?[0-9]+$)/
const decimalRegex = /(?:^[-+]?[0-9]+)(?:(?:\.[0-9]+)|(?:e[+-]?[0-9]+))$/
const numericRegex = /(?:^[-+]?[0-9]+)(?:(?:\.[0-9]+)|(?:e[+-]?[0-9]+))?$/

export const integer = {
  ruleName: 'integer number',
  message: 'The number does not appear to be a valid integer',
  validator: value => {
    const rawValue = String(unwrap(value))

    return Promise.resolve(intRegex.test(rawValue))
  },
} as RuleValidator<number | Ref<number>>

export const decimal = {
  ruleName: 'decimal number',
  message: 'The number does not appear to be in a valid decimal format',
  validator: value => {
    const rawValue = String(unwrap(value))
    return Promise.resolve(decimalRegex.test(rawValue))
  },
} as RuleValidator<number | Ref<number>>

export const numeric = {
  ruleName: 'numeric',
  message: 'The number does not appear to be a valid number',
  validator: value => {
    const rawValue = String(unwrap(value))
    return Promise.resolve(numericRegex.test(rawValue))
  },
} as RuleValidator<number | Ref<number>>

export const minValue = (min: number) => {
  return {
    ruleName: 'minimum value',
    message: `The number must be at least ${min}`,
    params: [min],
    validator: value => {
      const rawValue = parseFloat(unwrap(value))
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
