import test, { skip } from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { minValue } from '../../src/rules'

test.group('Tests for the built-in "minValue" validator', () => {
  test('success test', async assert => {
    // Object model
    const model = {
      name: ref('Mo'),
      age: ref(55),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        minValue: minValue(0),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)

    assert.exists(v)
    assert.isTrue(await v.validate())
    assert.isFalse(v.age.isInvalid)
    assert.isFalse(v.age.isDirty)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.length, 0)
  })

  test('failure test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      age: ref(55),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        minValue: minValue(1000),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.validate())
    assert.isTrue(v.age.isInvalid)
    assert.isFalse(v.age.isDirty)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.length, 1)

    // console.log(v.name.errors[0].toString())
  })
})
