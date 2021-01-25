import test from 'japa'
import { containsDigit, containsLowerCase, containsSymbol, containsUpperCase } from '../src/rules'

test.group('Tests the helper functions that check the kind of content in a string value', () => {
  // Lower case checks

  test('check for lowercase (success)', assert => {
    const password = 'PASSWoRD'

    assert.isTrue(containsLowerCase(password))
  })

  test('check for lowercase (failure)', assert => {
    const password = 'PASSWORD'

    assert.isFalse(containsLowerCase(password))
  })

  test('check for multiple LowerCase (success)', assert => {
    const password = 'PaSSWoRD'

    assert.isTrue(containsLowerCase(password, 2))
  })

  test('check for multiple LowerCase (failure)', assert => {
    const password = 'PASSWoRD'

    assert.isFalse(containsLowerCase(password, 2))
  })

  test('check for lowercase (undefined failure)', assert => {
    // @ts-ignore
    assert.isFalse(containsLowerCase(undefined))
  })

  // Upper case checks

  test('check for UpperCase (success)', assert => {
    const password = 'PASSWoRD'

    assert.isTrue(containsUpperCase(password))
  })

  test('check for UpperCase (failure)', assert => {
    const password = 'password'

    assert.isFalse(containsUpperCase(password))
  })

  test('check for multiple UpperCase (success)', assert => {
    const password = 'PassworD'

    assert.isTrue(containsUpperCase(password, 2))
  })

  test('check for multiple UpperCase (failure)', assert => {
    const password = 'passwoRd'

    assert.isFalse(containsUpperCase(password, 2))
  })

  test('check for UpperCase (undefined failure)', assert => {
    // @ts-ignore
    assert.isFalse(containsUpperCase(undefined))
  })

  // Digit checks

  test('check for Digit (success)', assert => {
    const password = 'PA33WoRD'

    assert.isTrue(containsDigit(password))
  })

  test('check for Digit (failure)', assert => {
    const password = 'paSSword'

    assert.isFalse(containsDigit(password))
  })

  test('check for multiple Digit (success)', assert => {
    const password = 'PassworD123'

    assert.isTrue(containsDigit(password, 2))
  })

  test('check for multiple Digit (failure)', assert => {
    const password = 'passwoRd1'

    assert.isFalse(containsDigit(password, 2))
  })

  test('check for Digit (undefined failure)', assert => {
    // @ts-ignore
    assert.isFalse(containsDigit(undefined))
  })

  // Symbol checks

  test('check for Symbol (success)', assert => {
    const password = 'PA$$WoRD'

    assert.isTrue(containsSymbol(password))
  })

  test('check for Symbol (failure)', assert => {
    const password = 'paSSword2'

    assert.isFalse(containsSymbol(password))
  })

  test('check for multiple Symbol (success)', assert => {
    const password = 'P@ssworD$'

    assert.isTrue(containsSymbol(password, 2))
  })

  test('check for multiple Symbol (failure)', assert => {
    const password = 'p@sswoRd1'

    assert.isFalse(containsSymbol(password, 2))
  })

  test('check for Symbol (undefined failure)', assert => {
    // @ts-ignore
    assert.isFalse(containsSymbol(undefined))
  })
})
