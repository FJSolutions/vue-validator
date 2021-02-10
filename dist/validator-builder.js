var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ref, reactive, computed, watch } from 'vue';
/**
 * Creates a validator for the supplied using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
export const useValidator = (model, rules, groupDefinition) => {
    // Create the empty root validator object
    const v = {};
    // Get the property structure for the model
    const descriptors = Object.getOwnPropertyDescriptors(model);
    const modelKeys = Object.keys(descriptors);
    // Create a list of Validation rules
    const validationRules = getValidationRules(modelKeys, rules);
    // Build the array of property rules
    const propertyRules = setPropertyRules(model, rules, descriptors, modelKeys);
    // Create the array of property validator objects
    const validatorProperties = propertyRules.map(pv => {
        // Get the rules for this property
        const propertyRules = validationRules.filter(r => r.propertyName === pv.propertyName);
        // Create the property validator instance
        const po = createPropertyValidator(model, propertyRules, pv.propertyName);
        Object.defineProperty(v, pv.propertyName, { value: po, enumerable: true, configurable: true, writable: true });
        return po;
    });
    // Create the root validator
    createValidator(v, propertyRules, validatorProperties);
    // Create group validator
    if (groupDefinition !== void 0) {
        createGroupValidator(v, validatorProperties, groupDefinition);
    }
    // Strongly type the returned object
    return reactive(v);
};
/******************************************
 *
 * Private builder methods
 *
 ******************************************/
const createGroupValidator = (v, validatorProperties, groupDefinition) => {
    // Get the list of groups names
    // const groupKeys = Object.keys(rules).filter(rn => !modelKeys.some(mn => mn === rn))
    const groupKeys = Object.keys(groupDefinition);
    // Loop the group names and create their group validators
    groupKeys.forEach(groupName => {
        // Get the property names and their validators for this group property
        const groupPropertyNames = Object.keys(groupDefinition[groupName]);
        const groupProperties = validatorProperties.filter(vp => groupPropertyNames.some(gpn => gpn === vp._propertyName));
        // This should be a Validator for the selected properties
        const gpv = createGroupPropertyValidator(groupProperties);
        groupProperties.forEach(gp => {
            Object.defineProperty(gpv, gp._propertyName, { value: gp, enumerable: true, configurable: true, writable: true });
        });
        // Add the group property with its group-validator to the root-validator
        Object.defineProperty(v, groupName, { value: gpv, enumerable: true, configurable: true, writable: true });
    });
};
// This creates the root validator property that represents a validation group
const createGroupPropertyValidator = (validatorProperties) => {
    const errors = ref(new Array());
    const isPending = ref(false);
    const isInvalid = computed(() => {
        let i = 0;
        let isValid = true;
        while (i < validatorProperties.length) {
            const vp = validatorProperties[i];
            if (vp.isInvalid) {
                isValid = false;
                break;
            }
            i += 1;
        }
        return !isValid;
    });
    const validate = () => __awaiter(void 0, void 0, void 0, function* () {
        isPending.value = true;
        errors.value.length = 0;
        let isValid = true;
        for (let i = 0; i < validatorProperties.length; i++) {
            const r = validatorProperties[i];
            if (!(yield r.validate())) {
                isValid = false;
                errors.value.push(...r.errors);
            }
        }
        isPending.value = false;
        return isValid;
    });
    return reactive({
        isPending: computed(() => isPending.value),
        isInvalid: computed(() => isInvalid.value),
        errors: computed(() => errors.value),
        hasErrors: computed(() => errors.value && errors.value.length > 0),
        validate,
    });
};
const createPropertyValidator = (context, rules, propertyName) => {
    const isDirty = ref(false);
    const isPending = ref(false);
    const errors = ref(new Array());
    const model = context[propertyName];
    const isInvalid = ref(false);
    // console.log('PropertyValidator.model', context[propertyName])
    // Watch for changes to the model
    watch(model, (value, oldValue) => __awaiter(void 0, void 0, void 0, function* () {
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
                let message = r.rule.message;
                if (typeof message === 'function') {
                    const ctx = Object.assign({ value: model.value, propertyName, ruleName: r.ruleName }, r.rule.params);
                    message = message(ctx);
                }
                errors.value.push({
                    message,
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
    return reactive({
        _propertyName: propertyName,
        isDirty: computed(() => isDirty.value),
        isPending: computed(() => isPending.value),
        hasErrors: computed(() => errors.value && errors.value.length > 0),
        errors: computed(() => errors.value),
        isInvalid: computed(() => isInvalid.value),
        model,
        validate,
    });
};
const createValidator = (v, propertyRules, validatorProperties) => {
    const isPending = ref(false);
    const errors = ref(new Array());
    const hasErrors = computed(() => errors.value && errors.value.length > 0);
    const isInvalid = computed(() => {
        let i = 0;
        let isValid = true;
        while (i < validatorProperties.length) {
            const vp = validatorProperties[i];
            if (!vp.isInvalid) {
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
                errors.value.push(...property.errors);
            }
        }
        isPending.value = false;
        return isValid;
    });
    Object.defineProperty(v, 'isPending', {
        value: isPending,
        enumerable: true,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(v, 'isInvalid', {
        value: isInvalid,
        enumerable: true,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(v, 'errors', {
        value: computed(() => errors.value),
        enumerable: true,
        configurable: true,
        writable: true,
    });
    Object.defineProperty(v, 'hasErrors', { value: hasErrors, enumerable: true, configurable: true, writable: true });
    Object.defineProperty(v, 'validate', { value: validate, enumerable: true, configurable: true, writable: true });
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
            validationModel: model,
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
