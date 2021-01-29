"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidator = exports.useRulesConstructor = void 0;
const vue_1 = require("vue");
/**
 * Wraps making a valid Rules configuration object byt supply ig type information as type parameters to this constructor funvtion
 *
 * @param validationDefinition An object literal that confirms to a validation configuration interface
 */
const useRulesConstructor = (validationDefinition) => {
    return validationDefinition;
};
exports.useRulesConstructor = useRulesConstructor;
/**
 * Creates a validator for the supplied model using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
const useValidator = (model, rules) => {
    // Get the property structure for the model
    const descriptors = Object.getOwnPropertyDescriptors(model);
    const modelKeys = Object.keys(descriptors);
    const v = {};
    // Create a list of Validation rules
    const validationRules = getValidationRules(modelKeys, rules);
    // The master list of property validators
    const propertyRules = setPropertyRules(model, rules, descriptors, modelKeys);
    // Create the list properties as validator objects
    const validatorProperties = propertyRules.map(pv => {
        const propertyRules = validationRules.filter(r => r.propertyName === pv.propertyName);
        const po = createPropertyValidator(model, propertyRules, pv.propertyName);
        Object.defineProperty(v, pv.propertyName, { value: po, enumerable: true, writable: false, configurable: false });
        return po;
    });
    // Create the root validator
    createValidator(v, propertyRules, validatorProperties);
    // Create group validator
    createGroupValidator(v, rules, modelKeys, validatorProperties);
    // Return a strongly typed validator for this configuration
    return v;
};
exports.useValidator = useValidator;
/******************************************
 *
 * Private builder methods
 *
 ******************************************/
const createGroupValidator = (v, rules, modelKeys, validatorProperties) => {
    // Get the list of groups names
    const groupKeys = Object.keys(rules).filter(rn => !modelKeys.some(mn => mn === rn));
    // Loop the group names and create their group validators
    groupKeys.forEach(gn => {
        const groupProperties = rules[gn].map(gpn => validatorProperties.find(vp => vp._propertyName === gpn));
        // This should be an IValidator for the selected properties
        const gpv = createGroupPropertyValidator(groupProperties);
        groupProperties.forEach(gp => {
            Object.defineProperty(gpv, gp._propertyName, { value: gp, enumerable: true, writable: false });
        });
        // Add the group property with its group-validator to the root-validator
        Object.defineProperty(v, gn, { value: gpv, enumerable: true, writable: false });
    });
};
const createGroupPropertyValidator = (validatorProperties) => {
    const errors = vue_1.ref(new Array());
    const isInvalid = vue_1.computed(() => {
        let i = 0;
        let isValid = true;
        while (i < validatorProperties.length) {
            const vp = validatorProperties[i];
            if (vp.isInvalid.value) {
                isValid = false;
                break;
            }
            i += 1;
        }
        return !isValid;
    });
    const validate = () => __awaiter(void 0, void 0, void 0, function* () {
        errors.value.length = 0;
        let isValid = true;
        for (let i = 0; i < validatorProperties.length; i++) {
            const r = validatorProperties[i];
            if (!(yield r.validate())) {
                isValid = false;
                errors.value.push(...r.errors.value);
            }
        }
        return isValid;
    });
    return {
        isInvalid,
        errors,
        hasErrors: vue_1.computed(() => errors.value && errors.value.length > 0),
        validate,
    };
};
const createPropertyValidator = (context, rules, propertyName) => {
    const isDirty = vue_1.ref(false);
    const isPending = vue_1.ref(false);
    const errors = vue_1.ref(new Array());
    const model = context[propertyName];
    const isInvalid = vue_1.ref(false);
    // Watch for changes to the model
    vue_1.watch(model, (value, oldValue) => __awaiter(void 0, void 0, void 0, function* () {
        isDirty.value = true;
        yield validate();
    }), { flush: 'sync' });
    // Validate all the rules for this property
    const validate = () => __awaiter(void 0, void 0, void 0, function* () {
        isPending.value = true;
        errors.value.length = 0;
        let isValid = true;
        for (let i = 0; i < rules.length; i++) {
            const r = rules[i];
            if (!(yield r.rule.validator(model.value, context))) {
                isValid = false;
                errors.value.push({
                    message: r.rule.message,
                    propertyName: propertyName,
                    ruleName: r.ruleName,
                    toString() {
                        return this.message;
                    },
                });
            }
        }
        isInvalid.value = !isValid;
        isPending.value = false;
        return isValid;
    });
    return {
        _propertyName: propertyName,
        isDirty: vue_1.computed(() => isDirty.value),
        isPending: vue_1.computed(() => isPending.value),
        hasErrors: vue_1.computed(() => errors.value && errors.value.length > 0),
        errors: vue_1.computed(() => errors.value),
        isInvalid: vue_1.computed(() => isInvalid.value),
        model,
        validate,
    };
};
const createValidator = (v, propertyRules, validatorProperties) => {
    const isPending = vue_1.ref(false);
    const errors = vue_1.ref(new Array());
    const hasErrors = vue_1.computed(() => errors.value && errors.value.length > 0);
    const isInvalid = vue_1.computed(() => {
        let i = 0;
        let isValid = true;
        while (i < validatorProperties.length) {
            const vp = validatorProperties[i];
            if (!vp.isInvalid.value) {
                isValid = false;
                break;
            }
            i += 1;
        }
        return isValid;
    });
    const validate = () => __awaiter(void 0, void 0, void 0, function* () {
        isPending.value = true;
        errors.value.length = 0;
        // Loop all the properties and validate them
        let isValid = true;
        for (let i = 0; i < propertyRules.length; i++) {
            const pr = propertyRules[i];
            const property = v[pr.propertyName];
            if (!(yield property.validate())) {
                isValid = false;
                errors.value.push(...property.errors.value);
            }
        }
        isPending.value = false;
        return isValid;
    });
    Object.defineProperty(v, 'isInvalid', {
        value: vue_1.computed(() => isInvalid.value),
        enumerable: true,
        writable: false,
        configurable: false,
    });
    Object.defineProperty(v, 'errors', {
        value: vue_1.computed(() => errors.value),
        enumerable: true,
        writable: false,
        configurable: false,
    });
    Object.defineProperty(v, 'hasErrors', { value: hasErrors, enumerable: true, writable: false, configurable: false });
    Object.defineProperty(v, 'validate', { value: validate, enumerable: true, writable: false, configurable: false });
};
const setPropertyRules = (model, rules, descriptors, modelKeys) => {
    const propertyValidators = modelKeys.map(key => {
        var _a;
        // Find the property's rule validator
        const ruleObj = (_a = Object.getOwnPropertyDescriptor(rules, key)) === null || _a === void 0 ? void 0 : _a.value;
        // Create a new property validator
        const pv = {
            propertyName: key,
            propertyModel: descriptors[key],
            rules: ruleObj,
            model,
        };
        return pv;
    });
    return propertyValidators;
};
const getValidationRules = (modelKeys, rules) => {
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
    return validationRules;
};
