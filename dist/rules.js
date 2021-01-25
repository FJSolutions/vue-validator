import { isRef } from 'vue';
/*****************************************
 *
 * Helper functions
 *
 ****************************************/
export const containsLowerCase = (value, numberOfOccurrences = 1) => {
    if (!value) {
        return false;
    }
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        if (count >= numberOfOccurrences)
            return true;
        const c = value.charAt(i);
        if (c == c.toLocaleLowerCase()) {
            count += 1;
        }
    }
    if (count >= numberOfOccurrences)
        return true;
    return false;
};
export const containsUpperCase = (value, numberOfOccurrences = 1) => {
    if (!value) {
        return false;
    }
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        if (count >= numberOfOccurrences)
            return true;
        const c = value.charAt(i);
        if (c == c.toLocaleUpperCase()) {
            count += 1;
        }
    }
    if (count >= numberOfOccurrences)
        return true;
    return false;
};
export const containsUpperOrLowerCase = (value, numberOfOccurrences = 1) => {
    if (!value) {
        return false;
    }
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        if (count >= numberOfOccurrences)
            return true;
        const c = value.charAt(i);
        if (c == c.toLocaleUpperCase()) {
            count += 1;
        }
        else if (c == c.toLocaleUpperCase()) {
            count += 1;
        }
    }
    if (count >= numberOfOccurrences)
        return true;
    return false;
};
export const containsDigit = (value, numberOfOccurrences = 1) => {
    if (!value) {
        return false;
    }
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        if (count >= numberOfOccurrences)
            return true;
        const c = value.charAt(i);
        if (c >= '0' && c <= '9') {
            count += 1;
        }
    }
    if (count >= numberOfOccurrences)
        return true;
    return false;
};
export const containsSymbol = (value, numberOfOccurrences = 1, symbols = [
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
]) => {
    if (!value) {
        return false;
    }
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        if (count >= numberOfOccurrences)
            return true;
        const c = value.charAt(i);
        if (symbols.some(s => s === c)) {
            count += 1;
        }
    }
    if (count >= numberOfOccurrences)
        return true;
    return false;
};
/****************************************
 *
 * String Rule validators
 *
 ****************************************/
const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const alphaRegex = /(?:^[a-zA-Z]+$)/;
const alphaNumericRegex = /(?:^[a-zA-Z0-9]+)$/;
export const required = {
    ruleName: 'required',
    message: 'Some text is required',
    validator: value => {
        const rawValue = isRef(value) ? value.value : value;
        return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length > 0);
    },
};
export const minLength = (min) => {
    return {
        ruleName: 'minimum length',
        message: `The text must be at least ${min} letters long`,
        params: [min],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min);
        },
    };
};
export const maxLength = (max) => {
    return {
        ruleName: 'maximum length',
        message: `The text must not be longer than ${max} letters long`,
        params: [max],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length <= max);
        },
    };
};
export const lengthBetween = (min, max) => {
    return {
        ruleName: 'length between',
        message: `The text must be between ${min} and ${max} letters long`,
        params: [min, max],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min && rawValue.length <= max);
        },
    };
};
export const emailAddress = {
    ruleName: 'email address',
    message: 'The text does not appear to be a valid email address',
    validator: value => {
        const rawValue = isRef(value) ? value.value : value;
        return Promise.resolve(emailRegex.test(rawValue));
    },
};
export const sameAs = (propertyName) => {
    return {
        ruleName: 'same as',
        message: `The text is not the same as ${propertyName}`,
        params: [propertyName],
        validator: (value, context) => {
            const otherValue = isRef(context === null || context === void 0 ? void 0 : context[propertyName])
                ? context === null || context === void 0 ? void 0 : context[propertyName].value : context === null || context === void 0 ? void 0 : context[propertyName];
            const rawValue = isRef(value) ? value.value : value;
            // console.log('sameAs()', rawValue, otherValue)
            return Promise.resolve(rawValue === otherValue);
        },
    };
};
export const isAlpha = {
    ruleName: 'same as',
    message: `The text contains non-alphabetic letters`,
    params: [],
    validator: value => {
        const rawValue = String(isRef(value) ? value.value : value) || '';
        let isValid = true;
        for (let i = 0; i < rawValue.length; i++) {
            const c = rawValue[i];
            if (c >= 'a' && c <= 'z') {
                continue;
            }
            else if (c >= 'A' && c <= 'Z') {
                continue;
            }
            // console.log(c)
            isValid = false;
            break;
        }
        return Promise.resolve(isValid);
    },
};
export const isAlphaNumeric = {
    ruleName: 'same as',
    message: `The text contains non-alphabetic letters`,
    params: [],
    validator: value => {
        const rawValue = String(isRef(value) ? value.value : value) || '';
        let isValid = true;
        for (let i = 0; i < rawValue.length; i++) {
            const c = rawValue[i];
            if (c >= 'a' && c <= 'z') {
                continue;
            }
            else if (c >= 'A' && c <= 'Z') {
                continue;
            }
            else if (c >= '0' && c <= '9') {
                continue;
            }
            // console.log(c)
            isValid = false;
            break;
        }
        return Promise.resolve(isValid);
    },
};
/***************************************************
 *
 * Numeric Rule Validators
 *
 **************************************************/
const intRegex = /(?:^[-+]?[0-9]+$)/;
const decimalRegex = /(?:^[-+]?[0-9]+)(?:(?:\.[0-9]+)|(?:e[+-]?[0-9]+))$/;
const numericRegex = /(?:^[-+]?[0-9]+)(?:(?:\.[0-9]+)|(?:e[+-]?[0-9]+))?$/;
export const integer = {
    ruleName: 'integer number',
    message: 'The number does not appear to be a valid integer',
    validator: value => {
        const rawValue = String(isRef(value) ? value.value : value);
        return Promise.resolve(intRegex.test(rawValue));
    },
};
export const decimal = {
    ruleName: 'decimal number',
    message: 'The number does not appear to be in a valid decimal format',
    validator: value => {
        const rawValue = String(isRef(value) ? value.value : value);
        return Promise.resolve(decimalRegex.test(rawValue));
    },
};
export const numeric = {
    ruleName: 'numeric',
    message: 'The number does not appear to be a valid number',
    validator: value => {
        const rawValue = String(isRef(value) ? value.value : value);
        return Promise.resolve(numericRegex.test(rawValue));
    },
};
export const minValue = (min) => {
    return {
        ruleName: 'minimum value',
        message: `The number must be at least ${min}`,
        params: [min],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min);
        },
    };
};
export const maxValue = (max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be at less than ${max}`,
        params: [max],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue <= max);
        },
    };
};
export const betweenValues = (min, max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be between ${min} and ${max}`,
        params: [min, max],
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min && rawValue <= max);
        },
    };
};
