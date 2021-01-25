var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ref } from 'vue';
/*****************************************
 *
 * Validation classes
 *
 *****************************************/
/**
 * The implementation of the root validator object
 */
export class Validator {
    constructor(validators, groupObject) {
        this._isInvalid = ref(false);
        this._hasErrors = ref(false);
        this._errors = new Array();
        this._validators = validators;
        this._groups = groupObject;
    }
    get isInvalid() {
        return this._isInvalid;
    }
    get errors() {
        return this._errors;
    }
    get hasErrors() {
        return this._hasErrors;
    }
    get groups() {
        return this._groups;
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._errors.length = 0;
            if (!this._validators) {
                this._isInvalid.value = false;
                return Promise.resolve(true);
            }
            let isValid = true;
            for (let i = 0; i < this._validators.length; i++) {
                const propertyValidator = this._validators[i];
                if (!(yield propertyValidator.validate(false))) {
                    isValid = false;
                    this._errors.push(...propertyValidator.errors);
                }
            }
            this._isInvalid.value = !isValid;
            this._hasErrors.value = this.errors.length > 0;
            return Promise.resolve(isValid);
        });
    }
}
/**
 * The implementation of a property validator
 */
export class PropertyValidator {
    constructor(propertyName, propertyModel, rules, model) {
        this._isDirty = ref(false);
        this._isInvalid = ref(false);
        this._hasErrors = ref(false);
        this._errors = new Array();
        this._model = model;
        this._propertyName = propertyName;
        this._rules = rules;
        const self = this;
        this._proxy = new Proxy(propertyModel, {
            get: function (target, prop, receiver) {
                return target.value;
            },
            set: function (target, prop, value, receiver) {
                // NB: This ALWAYS comes through as a string from a control!
                // console.log('Proxy.set:', value)
                // Default behavior
                target.value = value;
                // Fire the hook for validation
                self.setPropertyValue(value);
                // Return success in the process
                return true;
            },
        });
    }
    setPropertyValue(newValue) {
        if (newValue !== this._lastValue) {
            this._lastValue = newValue;
            this._isDirty.value = true;
            this.validate();
        }
    }
    get PropertyName() {
        return this._propertyName;
    }
    get isDirty() {
        return this._isDirty;
    }
    get isInvalid() {
        return this._isInvalid;
    }
    get errors() {
        return this._errors;
    }
    get hasErrors() {
        return this._hasErrors;
    }
    get model() {
        return this._proxy;
    }
    validate(skipDirty = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!skipDirty && this._isDirty.value) {
                return Promise.resolve(!this._isInvalid.value);
            }
            this._errors.length = 0;
            if (!this._rules) {
                this._isInvalid.value = false;
                return Promise.resolve(true);
            }
            let isValid = true;
            const keys = Object.keys(this._rules);
            for (let i = 0; i < keys.length; i++) {
                const validator = this._rules[keys[i]];
                if (!(yield validator.validator(this._proxy.value, this._model))) {
                    isValid = false;
                    this._errors.push({
                        message: validator.message,
                        propertyName: this._propertyName,
                        ruleName: validator.ruleName,
                        toString() {
                            return this.message;
                        },
                    });
                }
            }
            this._isInvalid.value = !isValid;
            this._hasErrors.value = this._errors.length > 0;
            return Promise.resolve(isValid);
        });
    }
}
export class GroupValidator {
    constructor(propertyValidators) {
        this._isInvalid = ref(false);
        this._hasErrors = ref(false);
        this._errors = new Array();
        this._propertyValidators = propertyValidators;
    }
    get isInvalid() {
        return this._isInvalid;
    }
    get errors() {
        return this._errors;
    }
    get hasErrors() {
        return this._hasErrors;
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._errors.length = 0;
            if (!this._propertyValidators) {
                this._isInvalid.value = false;
                return Promise.resolve(true);
            }
            let isValid = true;
            for (let j = 0; j < this._propertyValidators.length; j++) {
                const propertyValidator = this._propertyValidators[j];
                if (!(yield propertyValidator.validate(false))) {
                    isValid = false;
                    this._errors.push(...propertyValidator.errors);
                }
            }
            this._isInvalid.value = !isValid;
            this._hasErrors.value = this._errors.length > 0;
            return Promise.resolve(isValid);
        });
    }
}
