/**
 * The type definition of an object that defines the validation riles for a type
 */
export declare type Rules<T> = {
    [Key in keyof T]?: {
        readonly [key: string]: RuleValidator<T[Key]>;
    };
};
/**
 * The signature of a validation function: `async` function that takes a value and validates it
 */
export declare type ValidationFunction<T> = (value: any, context?: {
    [key: string]: any;
}) => Promise<Boolean>;
/**
 * Information about the context of the validation
 */
export interface ValidationMessageContext {
    /**
     * The property value that is being validated
     */
    readonly value: any;
    /**
     * The name of the rule that is generating the message
     */
    readonly ruleName?: string;
    /**
     * The name of the property that is being validated
     */
    readonly propertyName?: string;
    /**
     * The minimum length of the string or the minimum value of the number (if set)
     */
    readonly min?: number;
    /**
     * The maximum length of the string or the maximum value of the number (if set)
     */
    readonly max?: number;
    /**
     * The name of the other property that the rule may be referencing
     */
    readonly otherPropertyName?: string;
}
export declare type MessageFn = (ctx: ValidationMessageContext) => string;
/**
 * The definition of a validation rule object
 */
export declare type RuleValidator<T> = {
    /**
     * The name of the validation rule
     */
    readonly ruleName?: string;
    /**
     * The actual function that perform the validation
     */
    readonly validator: ValidationFunction<T>;
    /**
     * The error message to display when a validation fails, or a function that will generate the error message
     */
    readonly message: string | MessageFn;
    /**
     * Any parameters that the validation rule uses
     */
    readonly params?: {};
};
/**
 * Represents a validation error
 */
export declare type ValidationError = {
    readonly propertyName: string;
    readonly ruleName: string;
    readonly message: string;
};
/**
 * Represents the details of a validation rule
 */
export declare type ValidationRule<T> = {
    propertyName: string;
    ruleName: string;
    rule: RuleValidator<T>;
};
/**
 * Represents the details of model property's rule information
 */
export declare type PropertyRule<T> = {
    propertyName: string;
    propertyModel: T;
    rules: {
        [key: string]: RuleValidator<T>;
    };
    validationModel: any;
};
/*******************************************
 *
 * Public interfaces
 *
 *******************************************/
/**
 * The internal interface for a validator object
 */
export interface IPropertyValidator<T> extends Validator {
    /**
     * The name of the property that this validator is for
     */
    _propertyName: string;
    /**
     * Gets a value indicating if the validator has had its model value set
     */
    readonly isDirty: boolean;
    /**
     * The model object that is being validated
     */
    model: T;
}
/**************************************************************************
 *
 * New Types
 *
 **************************************************************************/
/**
 * The public interface for a model or group validator
 */
export interface Validator {
    /**
     * Gets a value indicating if the validator is in an invalid state after the last validation
     */
    readonly isInvalid: boolean;
    /**
     * Gets a list of errors from the last validation
     */
    readonly errors: Array<ValidationError>;
    /**
     * Gets a value indicating if there are errors
     */
    readonly hasErrors: boolean;
    /**
     * Gets a value indicating whether there are still pending validations
     */
    readonly isPending: boolean;
    /**
     * Trigger a validation
     *
     * @returns (async) true, if validation succeeds
     */
    validate(): Promise<boolean>;
}
/**
 * The public interface of a validator object
 */
export interface PropertyValidator<T> extends Validator {
    /**
     * Gets a value indicating if the validator has had its model value set
     */
    readonly isDirty: boolean;
    /**
     * The model object that is being validated
     */
    model: T;
}
