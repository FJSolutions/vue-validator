import test from 'japa'
import { useValidator } from '../src'

test.group('Testing Japa setup', () => {
  test('default test', assert => {
    assert.equal(1, 1)
  })

  test('importing the useValidator function', assert => {
    assert.exists(useValidator)
  })
})
