"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidator = void 0;
const Validator_1 = require("./Validator");
/**
 * Creates a validation object for the supplied model based on the supplied rules
 *
 * @param model The model object to validate
 * @param rules The object that defines the validations for a model
 */
const useValidator = (model, rules) => {
    // Get the property structure for the model
    const descriptors = Object.getOwnPropertyDescriptors(model);
    const modelKeys = Object.keys(descriptors);
    const validationRules = new Array();
    modelKeys.forEach(propertyName => {
        var _a;
        const pr = (_a = Object.getOwnPropertyDescriptor(rules, propertyName)) === null || _a === void 0 ? void 0 : _a.value;
        if (pr) {
            Object.keys(pr).forEach(ruleName => {
                const vr = { propertyName, ruleName, rule: pr[ruleName] };
                validationRules.push(vr);
            });
        }
    });
    // console.log(validationRules)
    // The master list of property validators
    const propertyValidators = modelKeys.map(key => {
        var _a;
        // Find the property's rule validator
        const rule = (_a = Object.getOwnPropertyDescriptor(rules, key)) === null || _a === void 0 ? void 0 : _a.value;
        // Create a new property validator
        const pv = new Validator_1.PropertyValidator(key, descriptors[key], rule, model);
        return pv;
    });
    // console.log(propertyValidators)
    // Create a Groups object
    const groupObject = {};
    Object.keys(rules)
        .filter(key => {
        for (let i = 0; i < propertyValidators.length; i++) {
            const vr = propertyValidators[i];
            if (vr.PropertyName === key) {
                return false;
            }
        }
        return true;
    })
        .map(key => {
        var _a;
        return {
            groupName: key,
            propertyNames: (_a = Object.getOwnPropertyDescriptor(rules, key)) === null || _a === void 0 ? void 0 : _a.value,
        };
    })
        // .filter(o => typeof o !== 'undefined')
        .forEach((gp) => {
        const vRules = new Array();
        gp.propertyNames.forEach((propertyName) => {
            const vr = propertyValidators.find(vr => vr.PropertyName === propertyName);
            if (vr) {
                vRules.push(vr);
            }
        });
        const group = Object.defineProperty(groupObject, gp.groupName, {
            value: new Validator_1.GroupValidator(vRules),
            enumerable: true,
            writable: false,
        });
    });
    // console.log('Group Object: ', groupObject)
    // Create the validation object and add the validation properties
    const v = new Validator_1.Validator(propertyValidators, groupObject);
    propertyValidators.forEach(pv => {
        // Add a property to the main validation object
        Object.defineProperty(v, pv.PropertyName, {
            configurable: false,
            enumerable: true,
            writable: false,
            value: pv,
        });
    });
    // const ro = (v as unknown) as ValidatorType
    // console.log(ro.groups)
    return v;
};
exports.useValidator = useValidator;
