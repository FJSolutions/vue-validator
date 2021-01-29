import test from 'japa'
import { ref } from 'vue'
import { useValidator, useRulesConstructor } from '../src/validator-factory'
import { required } from '../src/rules'
import { GroupRules, Rules } from '../src/types'

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
    assert.isFalse(v.isInvalid.value)
    assert.isFalse(v.hasErrors.value)
    assert.deepEqual(v.errors.value.length, 0)
    assert.exists(v.name)
    assert.exists(v.name.model)
    assert.exists(v.name.model.value)
    assert.isFalse(v.name.isDirty.value)
    assert.isFalse(v.name.isInvalid.value)
    assert.isFalse(v.name.hasErrors.value)
    assert.exists(v.address)
    assert.exists(v.address.model)
    assert.exists(v.address.model.value)
    assert.isFalse(v.address.isDirty.value)
    assert.isFalse(v.address.isInvalid.value)
    assert.isFalse(v.address.hasErrors.value)
    assert.deepEqual(v.address.errors.value.length, 0)
    // Property level validation is isolated
    assert.isFalse(await v.address.validate())
    assert.isFalse(v.address.isDirty.value)
    assert.isTrue(v.address.isInvalid.value)
    assert.isTrue(v.address.hasErrors.value)
    assert.deepEqual(v.address.errors.value.length, 1)
    assert.isFalse(v.hasErrors.value)
    // Root level validation bubbles down
    assert.isFalse(await v.validate())
    assert.isTrue(v.hasErrors.value)
    assert.isFalse(v.isInvalid.value)
    assert.deepEqual(v.errors.value.length, 2)
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
    // Rules model
    const rules: GroupRules<typeof model, { group1: any }> = {
      name: {
        required,
      },
      address: {
        required,
      },
      group1: ['name', 'age'],
    }
    // Create the validator
    const v = useValidator(model, rules)

    // console.log('useValidator:', v)

    assert.exists(v)
    // Root model assertions
    assert.isFalse(v.name.isInvalid.value)
    assert.isFalse(v.name.isDirty.value)
    assert.isFalse(await v.name.validate())
    assert.isTrue(v.name.isInvalid.value)
    assert.isFalse(v.name.isDirty.value)
    v.name.model.value = 'Francis'
    assert.deepEqual(v.name.model.value, 'Francis')
    assert.isTrue(v.name.isInvalid.value)
    assert.isTrue(v.name.isDirty.value)
    assert.isTrue(await v.name.validate())
  })

  test('adding groups to the validator', async assert => {
    // Object model
    const name = ref('')
    const age = ref(55)
    const address = ref('75 Valley Road')
    const model = { name, age, address } as const
    // Group type interface
    interface IGroup {
      personGroup: string[]
      addressGroup: string[]
    }
    // Rules model
    const rules = useRulesConstructor<typeof model, IGroup>({
      name: {
        required,
      },
      address: {
        required,
      },
      personGroup: ['name', 'age'],
      addressGroup: ['address'],
    })
    // Create the validator
    const v = useValidator(model, rules)

    assert.exists(v)
    // Group assertions
    assert.exists(v.personGroup)
    assert.exists(v.personGroup.name)
    assert.exists(v.personGroup.age)
    assert.notExists(v.personGroup.address)
    assert.isFalse(v.personGroup.isInvalid.value)
    assert.isFalse(v.personGroup.name.isInvalid.value)
    assert.isFalse(v.personGroup.age.isInvalid.value)
    assert.isFalse(await v.personGroup.validate())
    assert.isTrue(v.personGroup.name.isInvalid.value)
    assert.isFalse(v.personGroup.age.isInvalid.value)
    assert.isTrue(v.personGroup.isInvalid.value)
    assert.exists(v.address)
    assert.isFalse(v.addressGroup.isInvalid.value)
    assert.isTrue(await v.addressGroup.validate())
    assert.isFalse(v.addressGroup.isInvalid.value)
    assert.isFalse(v.addressGroup.address.isInvalid.value)
  })
})
