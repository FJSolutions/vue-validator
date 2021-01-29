import { GroupRules, Rules, RuleValidator, IValidator, IPropertyValidator } from './types';
/**
 * Wraps making a valid Rules configuration object byt supply ig type information as type parameters to this constructor funvtion
 *
 * @param validationDefinition An object literal that confirms to a validation configuration interface
 */
export declare const useRulesConstructor: <T, G>(validationDefinition: { [Key1 in keyof T]?: {
    [validatorName: string]: RuleValidator<T[Key1]>;
} | undefined; } & { [Key2 in keyof G]: (keyof T)[]; }) => { [Key1 in keyof T]?: {
    [validatorName: string]: RuleValidator<T[Key1]>;
} | undefined; } & { [Key2 in keyof G]: (keyof T)[]; };
/**
 * Creates a validator for the supplied model using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
export declare const useValidator: <T extends {
    [key: string]: any;
}, G = {}>(model: T, rules: Rules<T & {
    [key: string]: any;
}> | { [Key in keyof T]?: {
    [validatorName: string]: RuleValidator<T[Key]>;
} | undefined; } | { [Key_1 in keyof G]: (keyof T)[]; }) => IValidator & { [Key_2 in keyof T]: IPropertyValidator<T[Key_2]>; } & { [key in keyof G]: IValidator & {
    [key: string]: IValidator;
}; };
