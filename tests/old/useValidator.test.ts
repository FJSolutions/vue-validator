import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules, GroupRules } from '../../src'
import { required, minLength } from '../../src/rules'

test.group('Basic usage of useValidator', () => {
  test('takes a rules object and a model', assert => {
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

    // console.log(v)

    assert.exists(v)
    assert.exists(v.name)
    assert.exists(v.address)
    assert.exists(v.groups)
    assert.isFalse(v.isInvalid.value)
  })

  test('takes a rules group object and a model', assert => {
    // Object model
    const model = {
      name: ref(''),
      address: ref(''),
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

    assert.exists(v)
  })

  test('takes a rules object and a model and returns a Validator', assert => {
    // Object model
    const model = {
      name: ref(''),
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

    assert.exists(v)
    assert.isNotNull(v)
    assert.isObject(v)
    assert.exists(v.name)
    assert.exists(v.groups)
    assert.exists(v.name.model)
    assert.isFalse(v.name.isDirty.value)
    assert.isFalse(v.name.isInvalid.value)
    assert.exists(v.name.model.value, '')

    v.name.model.value = 'Francis'

    assert.exists(v.name.model.value, 'Francis')
    assert.isTrue(v.name.isDirty.value)
    assert.isFalse(v.name.isInvalid.value)
  })

  test('takes a group rules object and a model', assert => {
    // Object model
    const model = {
      name: '',
      address: '',
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
      group1: ['name', 'address'],
      group2: ['name'],
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)

    assert.exists(v.groups)
    assert.exists(v.groups.group1)
    assert.exists(v.groups['group1'])
    assert.exists(v.groups['group2'])
  })

  test('setting a "ref" with a string', assert => {
    const age = ref(42)
    // console.log(age)
    assert.deepEqual(age.value, 42)

    // @ts-ignore
    age.value = '31415e-4'
    // console.log(age)
    assert.notDeepEqual(age.value, 3.1415)
  })
})
