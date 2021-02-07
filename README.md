# vue-validator

A validation framework for [Vue 3](https://v3.vuejs.org) inspired by [Vuelidate 2](https://github.com/vuelidate/vuelidate/tree/next), with strong typing and intellisense.

**N.B.** This package is still in Alpha while I bed-down the best working architecture for its implementation.

## Basic Usage

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

The `v` validator object has a property structure like:

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

### Limitations

- The model has to have a flat structure
- The model's properties must all be `Ref` values

### Group rules

Property rules may be grouped together for partial validation"

```js
// Setup the model
const name = ref('')
const age = ref(55)
const address = ref('75 Valley Road')
const model = { name, age, address } as const
// Group type interface
interface IGroup {
  personGroup: string[]
  addressGroup: string[]
}
// Rules model
const rules = useRulesConstructor<typeof model, IGroup>({
  name: {
    required,
  },
  address: {
    required,
  },
  personGroup: ['name', 'age'],
  addressGroup: ['address'],
})
// Create the validator
const v = useValidator(model, rules)
```

- Setup the model using `ref()` values
- Create an interface that will define the group validators (it must be an interface for the type inference to work properly)
- Use the `useRulesConstructor` function to hide some of the complications of the type coercion to define the group rules
- Group rules are defined as a set of property rules followed by the group property names defined in the group interface with their properties being set to an array of the names of the model's properties
- The validator instance will contain all the same model validator properties as a normal validator, but also have the group properties that are validators, each of these will have the same property validators on them which are also on the root validator

**N.B.** The purpose of a group validator is to provide an interface for partial validation. So, after the `validate()` method has been called on the group validator it will have all the errors from the property validators in its `errors` property and it's `isInvalid` flag set. Similarly the root validator will have it's `isInvalid` flag set correctly, but it's errors will not be populated until `validate()` is called on it.

## Binding

In a Vue 3 template the `v` validator can be bound to attributes in the HTML like the following text box:

```html
<div>
  <label for="email">Email</label>
  <div>
    <input
      :class="{ 'is-error': v.email.isDirty && v.email.hasError }"
      type="email"
      name="email"
      id="email"
      v-model.trim="v.email.model"
      placeholder="Email address"
      required
    />
    <div v-if="v.email.hasErrors">
      <ul>
        <li v-for="err in v.email.errors" :key="err">{{ err.message }}</li>
      </ul>
    </div>
  </div>
</div>
```

## Grouping Validation

## Built-in Rules

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

### Helper functions (rules)

The following helper functions can be useful for creating a password rule

- containsLowerCase
- containsUpperCase
- containsUpperOrLowerCase
- containsDigit
- containsSymbol
