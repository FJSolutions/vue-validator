import { Ref } from 'vue';
import { RuleValidator } from './types';
/*****************************************
 *
 * Helper functions
 *
 ****************************************/
export declare const containsLowerCase: (value: string, numberOfOccurrences?: number) => boolean;
export declare const containsUpperCase: (value: string, numberOfOccurrences?: number) => boolean;
export declare const containsUpperOrLowerCase: (value: string, numberOfOccurrences?: number) => boolean;
export declare const containsDigit: (value: string, numberOfOccurrences?: number) => boolean;
export declare const containsSymbol: (value: string, numberOfOccurrences?: number, symbols?: string[]) => boolean;
export declare const required: RuleValidator<string | Ref<string>>;
export declare const minLength: (min: number) => RuleValidator<string | Ref<string>>;
export declare const maxLength: (max: number) => RuleValidator<string | Ref<string>>;
export declare const lengthBetween: (min: number, max: number) => RuleValidator<string | Ref<string>>;
export declare const emailAddress: RuleValidator<string | Ref<string>>;
export declare const sameAs: (propertyName: string) => RuleValidator<string | Ref<string>>;
export declare const isAlpha: RuleValidator<string | Ref<string>>;
export declare const isAlphaNumeric: RuleValidator<string | Ref<string>>;
export declare const integer: RuleValidator<number | Ref<number>>;
export declare const decimal: RuleValidator<number | Ref<number>>;
export declare const numeric: RuleValidator<number | Ref<number>>;
export declare const minValue: (min: number) => RuleValidator<number | Ref<number>>;
export declare const maxValue: (max: number) => RuleValidator<number | Ref<number>>;
export declare const betweenValues: (min: number, max: number) => RuleValidator<number | Ref<number>>;
