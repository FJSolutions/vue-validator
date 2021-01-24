import { IValidator, IPropertyValidator, GroupValidator } from './Validator';
import { RuleValidator } from './types';
/**
 * The type definition of an object that defines the validation riles for a type
 */
export declare type Rules<T> = {
    [Key in keyof T]?: {
        [key: string]: RuleValidator<T[Key]>;
    };
};
/**
 * The type definition of a group of validation rules for a type
 */
export declare type GroupRules<T> = {
    [Key in keyof T]?: {
        [validatorName: string]: RuleValidator<T[Key]>;
    };
} | {
    [groupName: string]: (keyof T)[];
};
/**
 * Creates a validation object for the supplied model based on the supplied rules
 *
 * @param model The model object to validate
 * @param rules The object that defines the validations for a model
 */
export declare const useValidator: <T>(model: T, rules: Rules<T & {
    [key: string]: any;
}> | { [Key in keyof T]?: {
    [validatorName: string]: RuleValidator<T[Key]>;
} | undefined; } | {
    [groupName: string]: (keyof T)[];
}) => IValidator<T, {
    [key: string]: GroupValidator;
}> & { [Key_1 in keyof T]: IPropertyValidator<T[Key_1]>; };
