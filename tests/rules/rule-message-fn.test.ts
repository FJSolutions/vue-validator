import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { required, sameAs } from '../../src/rules'

test.group('Testing the MessageFn error message creation process', () => {
  test('returning an error message from a function', async assert => {
    const errorMessage = `This is a required field`

    // Object model
    const model = {
      name: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required: {
          validator: required.validator,
          message: ctx => errorMessage,
        },
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.name.validate())
    assert.isTrue(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.isTrue(v.name.hasErrors)
    assert.deepEqual(v.name.errors.length, 1)
    assert.deepEqual(v.name.errors[0].message, errorMessage)
  })

  test('returning an error message from a function accessing specific properties', async assert => {
    const errorMessage = `This is a required field`

    // Object model
    const model = {
      password: ref(''),
      passwordConfirmation: ref('p@'),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      password: {
        required,
      },
      passwordConfirmation: {
        sameAs: {
          ...sameAs('password'),
          message: ctx => `The value '${ctx.value}' was not the same as that of ${ctx.otherPropertyName}`,
        },
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.validate())
    assert.isTrue(v.passwordConfirmation.isInvalid)
    assert.isFalse(v.passwordConfirmation.isDirty)
    assert.isTrue(v.passwordConfirmation.hasErrors)
    assert.deepEqual(v.passwordConfirmation.errors.length, 1)
    console.log(v.passwordConfirmation.errors[0].message)
  })
})
