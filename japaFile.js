require('ts-node').register()

const { configure } = require('japa')

configure({
  files: [
    'tests/rules/*.test.ts',
    'tests/*.test.ts',
  ]
})
