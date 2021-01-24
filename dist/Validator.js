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
exports.GroupValidator = exports.PropertyValidator = exports.Validator = void 0;
const vue_1 = require("vue");
/*****************************************
 *
 * Validation classes
 *
 *****************************************/
/**
 * The implementation of the root validator object
 */
class Validator {
    constructor(validators, groupObject) {
        this._isInvalid = vue_1.ref(false);
        this._hasErrors = vue_1.ref(false);
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
                const element = this._validators[i];
                if (!(yield element.validate())) {
                    isValid = false;
                    this._errors.push(...element.errors);
                }
            }
            this._isInvalid.value = !isValid;
            this._hasErrors.value = this.errors.length > 0;
            return Promise.resolve(isValid);
        });
    }
}
exports.Validator = Validator;
/**
 * The implementation of a property validator
 */
class PropertyValidator {
    constructor(propertyName, propertyModel, rules, model) {
        this._isDirty = vue_1.ref(false);
        this._isInvalid = vue_1.ref(false);
        this._hasErrors = vue_1.ref(false);
        this._errors = new Array();
        this._model = model;
        this._propertyName = propertyName;
        this._rules = rules;
        const self = this;
        this._proxy = new Proxy(propertyModel, {
            set: function (target, prop, value, receiver) {
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
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._errors.length = 0;
            if (!this._rules) {
                this._isInvalid.value = false;
                return Promise.resolve(true);
            }
            let isValid = true;
            const keys = Object.keys(this._rules);
            for (let i = 0; i < keys.length; i++) {
                const validator = this._rules[keys[i]];
                if (!(yield validator.validator(this.model.value, this._model))) {
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
exports.PropertyValidator = PropertyValidator;
class GroupValidator {
    constructor(propertyValidators) {
        this._isInvalid = vue_1.ref(false);
        this._hasErrors = vue_1.ref(false);
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
                const pv = this._propertyValidators[j];
                if (!(yield pv.validate())) {
                    isValid = false;
                    this._errors.push(...pv.errors);
                }
            }
            this._isInvalid.value = !isValid;
            this._hasErrors.value = this._errors.length > 0;
            return Promise.resolve(isValid);
        });
    }
}
exports.GroupValidator = GroupValidator;
