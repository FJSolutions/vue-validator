import { RuleValidator } from './types';
/*****************************************
 *
 * Helper functions
 *
 ****************************************/
export declare const containsLowerCase: (numberOfOccurrences?: number) => RuleValidator<string>;
export declare const containsUpperCase: (numberOfOccurrences?: number) => RuleValidator<string>;
export declare const containsUpperOrLowerCase: (numberOfOccurrences?: number) => RuleValidator<string>;
export declare const containsDigit: (numberOfOccurrences?: number) => RuleValidator<string>;
export declare const containsSymbol: (numberOfOccurrences?: number, symbols?: string[]) => RuleValidator<string>;
export declare const required: RuleValidator<string>;
export declare const minLength: (min: number) => RuleValidator<string>;
export declare const maxLength: (max: number) => RuleValidator<string>;
export declare const lengthBetween: (min: number, max: number) => RuleValidator<string>;
export declare const emailAddress: RuleValidator<string>;
export declare const sameAs: (otherPropertyName: string) => RuleValidator<string>;
export declare const isAlpha: RuleValidator<string>;
export declare const isAlphaNumeric: RuleValidator<string>;
export declare const integer: RuleValidator<number>;
export declare const decimal: RuleValidator<number>;
export declare const numeric: RuleValidator<number>;
export declare const minValue: (min: number) => RuleValidator<number>;
export declare const maxValue: (max: number) => RuleValidator<number>;
export declare const betweenValues: (min: number, max: number) => RuleValidator<number>;
