# vue-validator

A green-fields implementation of a validator for `Vue3` in `TypeScript` that provides good `IntelliSense`.
Inspired by [Vuelidate](https://github.com/vuelidate/vuelidate) 2

## Usage

## Limitations

- The model has to have a flat structure
- The model's properties must all be `Ref` values

## Rules

- Required
- EmailAddress
- MinLength
- MaxLength
- LengthBetween
- SameAs
- MaxValue
- MinValue
- ValueBetween

### ToDo

- IsAlpha
- IsNumeric
- IsAlphaNumeric
- IsInteger
- IsDecimal

- RequiredIf
- RequiredUnless
- And
- Or
- Not
