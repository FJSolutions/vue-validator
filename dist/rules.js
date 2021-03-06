import { isRef } from 'vue';
import { unwrap } from './helpers';
/*****************************************
 *
 * Helper functions
 *
 ****************************************/
export const containsLowerCase = (numberOfOccurrences = 1) => {
    return {
        ruleName: 'contains lower case',
        message: `The text must contain at least ${numberOfOccurrences} lower case letters`,
        validator: (value) => {
            if (!value) {
                return Promise.resolve(false);
            }
            let count = 0;
            for (let i = 0; i < value.length; i++) {
                if (count >= numberOfOccurrences)
                    return Promise.resolve(true);
                const c = value.charAt(i);
                if (c == c.toLocaleLowerCase()) {
                    count += 1;
                }
            }
            if (count >= numberOfOccurrences)
                return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };
};
export const containsUpperCase = (numberOfOccurrences = 1) => {
    return {
        ruleName: 'contains upper case',
        message: `The text must contain at least ${numberOfOccurrences} upper case letters`,
        validator: (value) => {
            if (!value) {
                return Promise.resolve(false);
            }
            let count = 0;
            for (let i = 0; i < value.length; i++) {
                if (count >= numberOfOccurrences)
                    return Promise.resolve(true);
                const c = value.charAt(i);
                if (c == c.toLocaleUpperCase()) {
                    count += 1;
                }
            }
            if (count >= numberOfOccurrences)
                return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };
};
export const containsUpperOrLowerCase = (numberOfOccurrences = 1) => {
    return {
        ruleName: 'contains upper or lower case',
        message: `The text must contain at least ${numberOfOccurrences} upper or lower case letters`,
        validator: (value) => {
            if (!value) {
                return Promise.resolve(false);
            }
            let count = 0;
            for (let i = 0; i < value.length; i++) {
                if (count >= numberOfOccurrences)
                    return Promise.resolve(true);
                const c = value.charAt(i);
                if (c == c.toLocaleUpperCase()) {
                    count += 1;
                }
                else if (c == c.toLocaleUpperCase()) {
                    count += 1;
                }
            }
            if (count >= numberOfOccurrences)
                return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };
};
export const containsDigit = (numberOfOccurrences = 1) => {
    return {
        ruleName: 'contains digits',
        message: `The text must contain at least ${numberOfOccurrences} numbers`,
        validator: (value) => {
            if (!value) {
                return Promise.resolve(false);
            }
            let count = 0;
            for (let i = 0; i < value.length; i++) {
                if (count >= numberOfOccurrences)
                    return Promise.resolve(true);
                const c = value.charAt(i);
                if (c >= '0' && c <= '9') {
                    count += 1;
                }
            }
            if (count >= numberOfOccurrences)
                return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };
};
export const containsSymbol = (numberOfOccurrences = 1, symbols = [
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
    return {
        ruleName: 'contains symbol characters',
        message: `The text must contain at least ${numberOfOccurrences} symbol characters`,
        validator: (value) => {
            if (!value) {
                return Promise.resolve(false);
            }
            let count = 0;
            for (let i = 0; i < value.length; i++) {
                if (count >= numberOfOccurrences)
                    return Promise.resolve(true);
                const c = value.charAt(i);
                if (symbols.some(s => s === c)) {
                    count += 1;
                }
            }
            if (count >= numberOfOccurrences)
                return Promise.resolve(true);
            return Promise.resolve(false);
        },
    };
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
        const isValid = (value) => {
            if (value === void 0 || value === null) {
                // If it is null of undefined it is invalid
                return false;
            }
            else if (typeof value === 'object') {
                // If it is a non-null object then it is valid
                return true;
            }
            else if (typeof value === 'string') {
                // If it is a string then it must be longer than 0
                return value.length > 0;
            }
            return false;
        };
        const rawValue = isRef(value) ? value.value : value;
        return Promise.resolve(isValid(rawValue));
    },
};
export const minLength = (min) => {
    return {
        ruleName: 'minimum length',
        message: `The text must be at least ${min} letters long`,
        params: { min },
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(rawValue !== void 0 && rawValue.length >= min);
        },
    };
};
export const maxLength = (max) => {
    return {
        ruleName: 'maximum length',
        message: `The text must not be longer than ${max} letters long`,
        params: { max },
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(rawValue !== void 0 && rawValue.length <= max);
        },
    };
};
export const lengthBetween = (min, max) => {
    return {
        ruleName: 'length between',
        message: `The text must be between ${min} and ${max} letters long`,
        params: { min, max },
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(rawValue !== void 0 && rawValue.length >= min && rawValue.length <= max);
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
export const sameAs = (otherPropertyName) => {
    return {
        ruleName: 'same as',
        message: `The text is not the same as ${otherPropertyName}`,
        params: { otherPropertyName },
        validator: (value, context) => {
            const otherValue = unwrap(context === null || context === void 0 ? void 0 : context[otherPropertyName]);
            const rawValue = unwrap(value);
            // console.log('sameAs()', rawValue, otherValue)
            return Promise.resolve(rawValue === otherValue);
        },
    };
};
export const isAlpha = {
    ruleName: 'same as',
    message: `The text contains non-alphabetic letters`,
    validator: (value) => {
        const rawValue = String(value) || '';
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
        const rawValue = String(unwrap(value));
        return Promise.resolve(intRegex.test(rawValue));
    },
};
export const decimal = {
    ruleName: 'decimal number',
    message: 'The number does not appear to be in a valid decimal format',
    validator: value => {
        const rawValue = String(unwrap(value));
        return Promise.resolve(decimalRegex.test(rawValue));
    },
};
export const numeric = {
    ruleName: 'numeric',
    message: 'The number does not appear to be a valid number',
    validator: value => {
        const rawValue = String(unwrap(value));
        return Promise.resolve(numericRegex.test(rawValue));
    },
};
export const minValue = (min) => {
    return {
        ruleName: 'minimum value',
        message: `The number must be at least ${min}`,
        params: { min },
        validator: value => {
            const rawValue = parseFloat(unwrap(value));
            return Promise.resolve(rawValue !== void 0 && rawValue >= min);
        },
    };
};
export const maxValue = (max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be at less than ${max}`,
        params: { max },
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(rawValue !== void 0 && rawValue <= max);
        },
    };
};
export const betweenValues = (min, max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be between ${min} and ${max}`,
        params: { min, max },
        validator: value => {
            const rawValue = isRef(value) ? value.value : value;
            return Promise.resolve(rawValue !== void 0 && rawValue >= min && rawValue <= max);
        },
    };
};
