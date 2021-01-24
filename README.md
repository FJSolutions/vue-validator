# vue-validator

A green-fields implementation of a validator for `Vue3` in `TypeScript` that provides good `IntelliSense`.
Inspired by [Vuelidate](https://github.com/vuelidate/vuelidate) 2

## Usage

```ts
// Object model
const model = {
  name: ref(''),
  address: ref(''),
}
// Rules model
const rules: Rules<typeof model> = {
  name: {
    required,
    minLength: minLength(3),
  },
  address: {
    required,
  },
}
// Pass in the model and rules
const v = useValidator(model, rules)
```

The `v` object now has a property structure like:

```sh
v
|- isInvalid
|- hasErrors
|- errors
|- groups
|   |- isInvalid
|   |- hasErrors
|   |- errors
|- name
|   |- isInvalid
|   |- isDirty
|   |- hasErrors
|   |- errors
|   L  model
L  address
    |- isInvalid
    |- isDirty
    |- hasErrors
    |- errors
    L  model
```

And each of the branches also has a `validate()` method that returns a `Promise<boolean>`.

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
