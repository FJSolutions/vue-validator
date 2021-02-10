import { UnwrapRef } from 'vue';
import { Rules, Validator, PropertyValidator } from './types';
/**
 * Creates a validator for the supplied using the rules as a definition
 *
 * @param model The model to validate
 * @param rules The rule definitions to validate the model against
 */
export declare const useValidator: <T extends {
    [key: string]: any;
}, G extends {
    [key: string]: { [key in keyof T]?: true | undefined; };
}>(model: T, rules: Rules<T & {
    [key: string]: any;
}>, groupDefinition?: G | undefined) => Validator & { [K in keyof T]: PropertyValidator<UnwrapRef<T[K]>>; } & { [K2 in keyof G]: Validator & Record<keyof G[K2], PropertyValidator<any>>; };
