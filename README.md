# vue-validator

A validation framework for [Vue 3](https://v3.vuejs.org) inspired by [Vuelidate 2](https://github.com/vuelidate/vuelidate/tree/next), with strong typing and intellisense for the resulting Validator object.

**N.B.** This package is still in Alpha while I bed-down the best working architecture for its implementation.

## Basic Usage

```ts
import { ref } from 'vue'
import { useValidator, required, minLength } from '@fjsolutions/vue-validator'

// Object model
const model = {
  name: ref(''),
  address: ref(''),
}
// Pass a model instance and configure model-property rules
const v = useValidator(model, {
  name: {
    required,
    minLength: minLength(3),
  },
  address: {
    required,
  },
})
```

**NB**

- The model must be setup using `ref()` values

The `v` Validator instance has a property interface:

```js
interface Validator {
  /**
   * Gets a value indicating if the validator is in an invalid state after the last validation
   */
  readonly isInvalid: boolean
  /**
   * Gets a list of errors from the last validation
   */
  readonly errors: Array<ValidationError>
  /**
   * Gets a value indicating if there are errors
   */
  readonly hasErrors: boolean
  /**
   * Gets a value indicating whether there are still pending validations
   */
  readonly isPending: boolean
  /**
   * Trigger a validation
   *
   * @returns (async) true, if validation succeeds
   */
  validate(): Promise<boolean>
}
```

To this interface are added property validators for every property on the model (whether they have validation rules assigned to them or not)

```js
export interface PropertyValidator<T> extends Validator {
  /**
   * Gets a value indicating if the validator has had its model value set
   */
  readonly isDirty: boolean
  /**
   * The model object that is being validated
   */
  model: T
}
```

When calling the `validate()` method calls are cascaded on to child validators.

**NB** All validation is lazy by default, meaning that `validate()` must be called explicitly on the main validator of group validator before it can be actually be guaranteed as valid.

### Limitations

- The model has to have a flat structure
- All the model's properties must be `Ref` values

### Group rules

Property rules may be grouped together for partial validation"

```js
// Setup the model
const name = ref('')
const age = ref(55)
const address = ref('75 Valley Road')
const model = { name, age, address } as const
// Create the validator
const v = useValidator(
  model,
  {
    name: {
      required,
    },
    address: {
      required,
    },
  },
  {
    personGroup: { name: true, age: true },
    addressGroup: { address: true },
  } as const,
)
```

**NB**

- Note that the group definition object is passed as the third (optional) argument to `useValidator` and is marked `as const`, it is essential that it is flagged as a constant or else intellisense will not work for the group.
- The group names have no intellisense when defining the group definition object, but their properties are property names of the model and all have the unused constant value of `true`.

### Purpose of Groups

The purpose of a group validator is to provide an interface for partial validation. So, after the `validate()` method has been called on the group validator it will have all the errors from the property validators in its `errors` property and it's `isInvalid` flag set. Similarly the root validator will have it's `isInvalid` flag set correctly, but it's errors will not be populated until `validate()` is called on it.

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

The following helper functions can be useful for creating a password rule:

- containsLowerCase
- containsUpperCase
- containsUpperOrLowerCase
- containsDigit
- containsSymbol
