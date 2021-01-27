import test, { skip } from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { maxValue } from '../../src/rules'

test.group('Tests for the built-in "maxValue" validator', () => {
  test('success test', async assert => {
    // Object model
    const model = {
      name: ref('Mo'),
      age: ref(55),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        maxValue: maxValue(100),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)

    assert.exists(v)
    assert.isTrue(await v.validate())
    assert.isFalse(v.age.isInvalid.value)
    assert.isFalse(v.age.isDirty.value)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.value.length, 0)
  })

  test('failure test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      age: ref(1000),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        maxValue: maxValue(120),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.validate())
    assert.isTrue(v.age.isInvalid.value)
    assert.isFalse(v.age.isDirty.value)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.value.length, 1)

    // console.log(v.name.errors[0].toString())
  })
})
