import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { minLength } from '../../src/rules'

test.group('Tests for the built-in "minLength" validator', () => {
  test('success test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        minLength: minLength(3),
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

  test('failure test', async assert => {
    // Object model
    const model = {
      name: ref(''),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        minLength: minLength(3),
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
