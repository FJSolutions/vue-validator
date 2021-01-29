require('ts-node').register({
  compilerOptions: {
    "target": "ES6",
    "module": "CommonJS"
  }
})

const { configure } = require('japa')

configure({
  files: [
    'tests/rules/*.test.ts',
    'tests/*.test.ts',
  ]
})
