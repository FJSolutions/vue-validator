import { Ref } from 'vue';
import { RuleValidator, ValidationError } from './types';
/*******************************************
 *
 * Public interfaces
 *
 *******************************************/
interface IRootValidator {
    /**
     * Gets a value indicating if the validator is in an invalid state after the last validation
     */
    readonly isInvalid: Ref<boolean>;
    /**
     * Gets a list of errors from the last validation
     */
    readonly errors: Array<ValidationError>;
    /**
     * Gets a value indicating if there are errors
     */
    readonly hasErrors: Ref<boolean>;
    /**
     * Trigger a validation
     *
     * @returns (async) true, if validation succeeds
     */
    validate(): Promise<boolean>;
}
/**
 * The interface for the root validator
 */
export interface IValidator<T, G> extends IRootValidator {
    /**
     * An object containing any validation groups
     */
    readonly groups: G;
}
/**
 * The public interface of a validator object
 */
export interface IPropertyValidator<T> extends IRootValidator {
    /**
     * Gets a value indicating if the validator has had its model value set
     */
    readonly isDirty: Ref<boolean>;
    /**
     * The validator's model (for binding purposes)
     */
    readonly model: T;
}
/*****************************************
 *
 * Validation classes
 *
 *****************************************/
/**
 * The implementation of the root validator object
 */
export declare class Validator<T, G> implements IValidator<T, G> {
    private _isInvalid;
    private _hasErrors;
    private _errors;
    private _groups;
    private _validators;
    constructor(validators: Array<PropertyValidator<any, any>>, groupObject: G);
    get isInvalid(): Ref<boolean>;
    get errors(): ValidationError[];
    get hasErrors(): Ref<boolean>;
    get groups(): G;
    validate(): Promise<boolean>;
}
/**
 * The implementation of a property validator
 */
export declare class PropertyValidator<T extends Ref, M> implements IPropertyValidator<T> {
    private _isDirty;
    private _isInvalid;
    private _hasErrors;
    private _errors;
    private _proxy;
    private _lastValue?;
    private _propertyName;
    private _rules;
    private _model;
    constructor(propertyName: string, propertyModel: T, rules: {
        [key: string]: RuleValidator<T>;
    }, model: M);
    private setPropertyValue;
    get PropertyName(): string;
    get isDirty(): Ref<boolean>;
    get isInvalid(): Ref<boolean>;
    get errors(): ValidationError[];
    get hasErrors(): Ref<boolean>;
    get model(): any;
    validate(skipDirty?: boolean): Promise<boolean>;
}
export declare class GroupValidator implements IRootValidator {
    private _isInvalid;
    private _hasErrors;
    private _errors;
    private _propertyValidators;
    constructor(propertyValidators: PropertyValidator<any, any>[]);
    get isInvalid(): Ref<boolean>;
    get errors(): ValidationError[];
    get hasErrors(): Ref<boolean>;
    validate(): Promise<boolean>;
}
export {};
