import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../src'
import { required } from '../src/validators'

test.group('Tests the ValidatorFactory implementation', () => {
  test('basic useValidator test', async assert => {
    // Object model
    const model = {
      name: ref(''),
      age: ref(55),
      address: ref(''),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      name: {
        required,
      },
      address: {
        required,
      },
    }
    // Create the validator
    const v = useValidator(model, rules)

    // console.log('useValidator:', v)

    assert.exists(v)
    // Property watcher assertions
    assert.isFalse(v.isInvalid)
    assert.isFalse(v.hasErrors)
    assert.deepEqual(v.errors.length, 0)
    assert.exists(v.name)
    assert.exists(v.name.model)
    assert.exists(v.name.model)
    assert.isFalse(v.name.isDirty)
    assert.isFalse(v.name.isInvalid)
    assert.isFalse(v.name.hasErrors)
    assert.exists(v.address)
    assert.exists(v.address.model)
    assert.exists(v.address.model)
    assert.isFalse(v.address.isDirty)
    assert.isFalse(v.address.isInvalid)
    assert.isFalse(v.address.hasErrors)
    assert.deepEqual(v.address.errors.length, 0)
    // Property level validation is isolated
    assert.isFalse(await v.address.validate())
    assert.isFalse(v.address.isDirty)
    assert.isTrue(v.address.isInvalid)
    assert.isTrue(v.address.hasErrors)
    assert.deepEqual(v.address.errors.length, 1)
    assert.isFalse(v.hasErrors)
    // Root level validation bubbles down
    assert.isFalse(await v.validate())
    assert.isTrue(v.hasErrors)
    assert.isFalse(v.isInvalid)
    assert.deepEqual(v.errors.length, 2)
    // Property with no validators
    assert.exists(v.age)
    assert.exists(v.age.model)
    assert.isTrue(await v.age.validate())
  })

  test('watching validator being set', async assert => {
    // Object model
    const model = {
      name: ref(''),
      age: ref(55),
      address: ref(''),
    }
    // Create the validator
    const v = useValidator(model, {
      name: {
        required,
      },
      address: {
        required,
      },
    })

    // console.log('useValidator:', v)

    assert.exists(v)
    // Root model assertions
    assert.isFalse(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    assert.isFalse(await v.name.validate())
    assert.isTrue(v.name.isInvalid)
    assert.isFalse(v.name.isDirty)
    v.name.model = 'Francis'
    assert.deepEqual(v.name.model, 'Francis')
    assert.isTrue(v.name.isInvalid)
    assert.isTrue(v.name.isDirty)
    assert.isTrue(await v.name.validate())
  })

  test('adding groups to the validator', async assert => {
    // Object model
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

    assert.exists(v)
    // Group assertions
    assert.exists(v.personGroup)
    assert.exists(v.personGroup.name)
    assert.exists(v.personGroup.age)
    // @ts-ignore '"address" property not present on the "personalGroup" group validator'
    assert.notExists(v.personGroup.address)
    assert.isFalse(v.personGroup.isInvalid)
    assert.isFalse(v.personGroup.name.isInvalid)
    assert.isFalse(v.personGroup.age.isInvalid)
    assert.isFalse(await v.personGroup.validate())
    assert.isTrue(v.personGroup.name.isInvalid)
    assert.isFalse(v.personGroup.age.isInvalid)
    assert.isTrue(v.personGroup.isInvalid)
    assert.exists(v.address)
    assert.isFalse(v.addressGroup.isInvalid)
    assert.isTrue(await v.addressGroup.validate())
    assert.isFalse(v.addressGroup.isInvalid)
    assert.isFalse(v.addressGroup.address.isInvalid)
  })
})
