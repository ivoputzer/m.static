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

  test('parses multiple flag ignoring not paired options', () => {
    const args = ['--port', '8080', '--cwd', '.', '12']
    deepEqual(parse(args), {port: '8080', cwd: '.'})
  })

  test('ignores items that not starts with --', () => {
    const args = ['should', 'be', 'ignored', '--port', '8080', '--cwd', '.']
    deepEqual(parse(args), {port: '8080', cwd: '.'})
  })

  test('empty option if no flags', () => {
    const args = ['should', 'be', 'ignored']
    deepEqual(parse(args), {})
  })
})
