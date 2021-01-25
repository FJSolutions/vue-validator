# vue-validator

A green-fields implementation of a validator for `Vue3` in `TypeScript` that provides good `IntelliSense`.
Inspired by [Vuelidate](https://github.com/vuelidate/vuelidate) 2

## Usage

```ts
import { ref } from 'vue'
import { useValidator, Rules, GroupRules } from '@fjsolutions/vue-validator'
import { required, minLength } from '@fjsolutions/vue-validator/dist/rules'

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
+---isInvalid
+---hasErrors
+---errors
+---groups
|   +---isInvalid
|   +---hasErrors
|   \---errors
+---name
|   +---isInvalid
|   +---isDirty
|   +---hasErrors
|   +---errors
|   \--- model
\---address
    +---isInvalid
    +---isDirty
    +---hasErrors
    +---errors
    \---model
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
- IsInteger
- IsDecimal
- IsNumeric
- IsNumeric
- IsAlpha
- IsAlphaNumeric

### Helper functions

The following helper functions can be useful for creating a password rule

- containsLowerCase
- containsUpperCase
- containsUpperOrLowerCase
- containsDigit
- containsSymbol

### ToDo (Possibly)

- RequiredIf
- RequiredUnless
- And
- Or
- Not
