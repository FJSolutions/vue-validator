import test from 'japa'
import { ref } from 'vue'
import { useValidator, Rules } from '../../src'
import { sameAs } from '../../src/rules'

test.group('Tests for the built-in "sameAs" validator', () => {
  test('existing valid value succeeds', async assert => {
    // Object model
    const model = {
      password: ref('p@s$w0rd'),
      passwordConfirmation: ref('p@s$w0rd'),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      password: {
        sameAs: sameAs('passwordConfirmation'),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)

    assert.isFalse(v.isInvalid)
    assert.isFalse(v.password.isInvalid)
    assert.isFalse(v.passwordConfirmation.isInvalid)
    assert.isTrue(await v.validate())
    assert.isFalse(v.isInvalid)
    assert.isFalse(v.password.isInvalid)
    assert.isFalse(v.passwordConfirmation.isInvalid)
  })

  test('existing invalid value fails', async assert => {
    // Object model
    const model = {
      password: ref('p@s$w0rd'),
      passwordConfirmation: ref('NONE'),
    }
    // Rules model
    const rules: Rules<typeof model> = {
      password: {
        sameAs: sameAs('passwordConfirmation'),
      },
    }
    // Pass in the model and rules
    const v = useValidator(model, rules)

    // console.log(v)

    assert.isFalse(v.isInvalid)
    assert.isFalse(v.password.isInvalid)
    assert.isFalse(v.passwordConfirmation.isInvalid)
    assert.isFalse(await v.validate())
    assert.isFalse(v.isInvalid)
    assert.isTrue(v.password.isInvalid)
    assert.isFalse(v.passwordConfirmation.isInvalid)
  })
})
