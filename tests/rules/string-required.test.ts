import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { required } from '../../src/rules'

test.group('Tests for the built-in "required" validator', () => {
  test('existing valid value succeeds', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isTrue(await v.name.validate())
    assert.isFalse(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.exists(v.name.errors)
    assert.equal(v.name.errors.length, 0)
  })

  test('existing invalid value fails', async assert => {
    // Object model
    const model = {
      name: ref(''),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.name.validate())
    assert.isTrue(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.exists(v.name.errors)
    assert.equal(v.name.errors.length, 1)

    // console.log(v.name.errors[0].toString())
  })
})
