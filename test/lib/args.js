const {deepEqual} = require('assert')
const {parse} = require('../../lib/args')

test('m.args', () => {
  test('parses one flag', () => {
    const args = ['--port', '8080']
    deepEqual(parse(args), {port: '8080'})
  })

  test('parses multiple flag', () => {
    const args = ['--port', '8080', '--cwd', '.']
    deepEqual(parse(args), {port: '8080', cwd: '.'})
  })
})
