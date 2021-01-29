import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { required, emailAddress } from '../../src/rules'

test.group('Tests for the built-in "emailAddress" validator', () => {
  test('success test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      email: ref('fjudge@gmail.co.za'),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required,
      },
      email: {
        required,
        emailAddress,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isTrue(await v.validate())
    assert.isFalse(v.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.isFalse(v.email.isDirty)
    assert.exists(v.errors)
    assert.equal(v.errors.length, 0)
  })

  test('failure test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      email: ref('f judge@gmail.c'),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required,
      },
      email: {
        required,
        emailAddress,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(v.isInvalid)
    assert.isFalse(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.isFalse(await v.validate())
    assert.isFalse(v.isInvalid)
    assert.isTrue(v.email.isInvalid)
    assert.isFalse(v.email.isDirty)
    assert.isFalse(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.equal(v.errors.length, 1)
  })
})
