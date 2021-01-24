"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betweenValues = exports.maxValue = exports.minValue = exports.integer = exports.sameAs = exports.emailAddress = exports.lengthBetween = exports.maxLength = exports.minLength = exports.required = void 0;
const vue_1 = require("vue");
/****************************************
 *
 * String Rule validators
 *
 ****************************************/
const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
exports.required = {
    ruleName: 'required',
    message: 'Some text is required',
    validator: value => {
        const rawValue = vue_1.isRef(value) ? value.value : value;
        return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length > 0);
    },
};
const minLength = (min) => {
    return {
        ruleName: 'minimum length',
        message: `The text must be at least ${min} letters long`,
        params: [min],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min);
        },
    };
};
exports.minLength = minLength;
const maxLength = (max) => {
    return {
        ruleName: 'maximum length',
        message: `The text must not be longer than ${max} letters long`,
        params: [max],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length <= max);
        },
    };
};
exports.maxLength = maxLength;
const lengthBetween = (min, max) => {
    return {
        ruleName: 'length between',
        message: `The text must be between ${min} and ${max} letters long`,
        params: [min, max],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue.length >= min && rawValue.length <= max);
        },
    };
};
exports.lengthBetween = lengthBetween;
exports.emailAddress = {
    ruleName: 'email address',
    message: 'The text does not appear to be a valid email address',
    validator: value => {
        const rawValue = vue_1.isRef(value) ? value.value : value;
        return Promise.resolve(emailRegex.test(rawValue));
    },
};
const sameAs = (propertyName) => {
    return {
        ruleName: 'same as',
        message: `The text is not the same as ${propertyName}`,
        params: [propertyName],
        validator: (value, context) => {
            const otherValue = vue_1.isRef(context === null || context === void 0 ? void 0 : context[propertyName])
                ? context === null || context === void 0 ? void 0 : context[propertyName].value : context === null || context === void 0 ? void 0 : context[propertyName];
            const rawValue = vue_1.isRef(value) ? value.value : value;
            // console.log('sameAs()', rawValue, otherValue)
            return Promise.resolve(rawValue === otherValue);
        },
    };
};
exports.sameAs = sameAs;
/***************************************************
 *
 * Numeric Rule Validators
 *
 **************************************************/
const intRegex = /(^[0-9]*$)|(^-[0-9]+$)/;
exports.integer = {
    ruleName: 'email address',
    message: 'The number does not appear to be a valid integer',
    validator: value => {
        const rawValue = String(vue_1.isRef(value) ? value.value : value);
        return Promise.resolve(intRegex.test(rawValue));
    },
};
const minValue = (min) => {
    return {
        ruleName: 'minimum value',
        message: `The number must be at least ${min}`,
        params: [min],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min);
        },
    };
};
exports.minValue = minValue;
const maxValue = (max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be at less than ${max}`,
        params: [max],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue <= max);
        },
    };
};
exports.maxValue = maxValue;
const betweenValues = (min, max) => {
    return {
        ruleName: 'maximum value',
        message: `The number must be between ${min} and ${max}`,
        params: [min, max],
        validator: value => {
            const rawValue = vue_1.isRef(value) ? value.value : value;
            return Promise.resolve(typeof rawValue !== 'undefined' && rawValue >= min && rawValue <= max);
        },
    };
};
exports.betweenValues = betweenValues;
