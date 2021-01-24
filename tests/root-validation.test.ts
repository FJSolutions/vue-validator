import test from 'japa'
import { Ref, ref } from 'vue'
import { useValidator, Rules, GroupRules } from '../src'
import { required, minLength } from '../src/rules'

test.group('Test the root validator properties and methods', () => {
  test('success when all properties are valid', async assert => {
    // Object model
    const model = {
      name: ref('Work'),
      address: ref('2 Blesbok Road'),
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
    // Assertions
    assert.exists(v)
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
    assert.isTrue(await v.validate())
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
  })

  test('failure when any property is invalid', async assert => {
    // Object model
    const model = {
      name: ref(''),
      address: ref('2 Blesbok Road'),
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
    // Assertions
    assert.exists(v)
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
    assert.isFalse(await v.validate())
    assert.isTrue(v.isInvalid.value)
    assert.isTrue(v.hasErrors.value)
    assert.equal(v.errors.length, 2)
  })

  test('failure when all properties are  invalid', async assert => {
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
    // Assertions
    assert.exists(v)
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
    assert.isFalse(await v.validate())
    assert.isTrue(v.isInvalid.value)
    assert.isTrue(v.hasErrors.value)
    assert.equal(v.errors.length, 3)
  })

  test('Success for one group when its properties are valid', async assert => {
    // Object model
    const model = {
      name: ref(''),
      address: ref('2 Blesbok'),
    }
    // Rules model
    const rules: GroupRules<typeof model> = {
      name: {
        required,
        minLength: minLength(3),
      },
      address: {
        required,
      },
      group1: ['name'],
      group2: ['address'],
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)
    // Assertions
    assert.exists(v)
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)

    assert.isFalse(v.groups.group1.isInvalid.value)
    assert.isFalse(v.groups.group1.hasErrors.value)
    assert.isFalse(await v.groups.group1.validate())
    assert.isTrue(v.groups.group1.isInvalid.value)
    assert.isTrue(v.groups.group1.hasErrors.value)
    assert.equal(v.groups.group1.errors.length, 2)

    assert.isFalse(v.groups.group2.isInvalid.value)
    assert.isFalse(v.groups.group2.hasErrors.value)
    assert.isTrue(await v.groups.group2.validate())
    assert.isFalse(v.groups.group2.isInvalid.value)
    assert.isFalse(v.groups.group2.hasErrors.value)

    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
    assert.isFalse(await v.validate())
    assert.isTrue(v.isInvalid.value)
    assert.isTrue(v.hasErrors.value)
  })
})
