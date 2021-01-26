import test, { skip } from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { integer } from '../../src/rules'

test.group('Tests for the built-in "integer" validator', () => {
  test('success test', async assert => {
    // Object model
    const model = {
      name: ref('Mo'),
      age: ref(55),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        integer,
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
    assert.equal(v.age.errors.length, 0)
  })

  test('success test with string', async assert => {
    // Object model
    const model = {
      name: ref('Mo'),
      age: ref(0.0),
    }
    // @ts-ignore
    model.age = '55'
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        integer,
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
    assert.equal(v.age.errors.length, 0)
  })

  test('failure test', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      age: ref(55.5),
      // address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        integer,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.validate())
    assert.isTrue(v.age.isInvalid.value)
    assert.isFalse(v.age.isDirty.value)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.length, 1)

    // console.log(v.name.errors[0].toString())
  })

  test('failure test with string', async assert => {
    // Object model
    const model = {
      name: ref('Francis'),
      age: ref(55),
    }
    // @ts-ignore
    model.age = '123.4'
    // Rules model
    const rules: Rules<typeof model> = {
      age: {
        integer,
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)
    assert.isFalse(await v.validate())
    assert.isTrue(v.age.isInvalid.value)
    assert.isFalse(v.age.isDirty.value)
    assert.exists(v.age.errors)
    assert.equal(v.age.errors.length, 1)

    // console.log(v.name.errors[0].toString())
  })
})