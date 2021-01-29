import test from 'japa'
import { containsDigit, containsLowerCase, containsSymbol, containsUpperCase } from '../../src/rules'

test.group('Tests the helper functions that check the kind of content in a string value', () => {
  // Lower case checks

  test('check for lowercase (success)', async assert => {
    const password = 'PASSWoRD'

    assert.isTrue(await containsLowerCase().validator(password))
  })

  test('check for lowercase (failure)', async assert => {
    const password = 'PASSWORD'

    assert.isFalse(await containsLowerCase().validator(password))
  })

  test('check for multiple LowerCase (success)', async assert => {
    const password = 'PaSSWoRD'

    assert.isTrue(await containsLowerCase(2).validator(password))
  })

  test('check for multiple LowerCase (failure)', async assert => {
    const password = 'PASSWoRD'

    assert.isFalse(await containsLowerCase(2).validator(password))
  })

  test('check for lowercase (undefined failure)', async assert => {
    // @ts-ignore
    assert.isFalse(await containsLowerCase().validator(undefined))
  })

  // Upper case checks

  test('check for UpperCase (success)', async assert => {
    const password = 'PASSWoRD'

    assert.isTrue(await containsUpperCase().validator(password))
  })

  test('check for UpperCase (failure)', async assert => {
    const password = 'password'

    assert.isFalse(await containsUpperCase().validator(password))
  })

  test('check for multiple UpperCase (success)', async assert => {
    const password = 'PassworD'

    assert.isTrue(await containsUpperCase(2).validator(password))
  })

  test('check for multiple UpperCase (failure)', async assert => {
    const password = 'passwoRd'

    assert.isFalse(await containsUpperCase(2).validator(password))
  })

  test('check for UpperCase (undefined failure)', async assert => {
    // @ts-ignore
    assert.isFalse(await containsUpperCase().validator(undefined))
  })

  // Digit checks

  test('check for Digit (success)', async assert => {
    const password = 'PA33WoRD'

    assert.isTrue(await containsDigit().validator(password))
  })

  test('check for Digit (failure)', async assert => {
    const password = 'paSSword'

    assert.isFalse(await containsDigit().validator(password))
  })

  test('check for multiple Digit (success)', async assert => {
    const password = 'PassworD123'

    assert.isTrue(await containsDigit(2).validator(password))
  })

  test('check for multiple Digit (failure)', async assert => {
    const password = 'passwoRd1'

    assert.isFalse(await containsDigit(2).validator(password))
  })

  test('check for Digit (undefined failure)', async assert => {
    // @ts-ignore
    assert.isFalse(await containsDigit().validator(undefined))
  })

  // Symbol checks

  test('check for Symbol (success)', async assert => {
    const password = 'PA$$WoRD'

    assert.isTrue(await containsSymbol().validator(password))
  })

  test('check for Symbol (failure)', async assert => {
    const password = 'paSSword2'

    assert.isFalse(await containsSymbol().validator(password))
  })

  test('check for multiple Symbol (success)', async assert => {
    const password = 'P@ssworD$'

    assert.isTrue(await containsSymbol(2).validator(password))
  })

  test('check for multiple Symbol (failure)', async assert => {
    const password = 'p@sswoRd1'

    assert.isFalse(await containsSymbol(2).validator(password))
  })

  test('check for Symbol (undefined failure)', async assert => {
    // @ts-ignore
    assert.isFalse(await containsSymbol().validator(undefined))
  })
})
