const {deepStrictEqual} = require('assert')
const {parse} = require('../../lib/args')

test('m.args', () => {
  test('parses one flag', () => {
    const args = ['--cwd', '.']
    deepStrictEqual(parse(args), {cwd: '.'})
  })

  test('parses numeric flag', () => {
    const args = ['--port', '8080']
    deepStrictEqual(parse(args), {port: 8080})
  })

  test('parses multiple flag', () => {
    const args = ['--port', '8080', '--cwd', '.']
    deepStrictEqual(parse(args), {port: 8080, cwd: '.'})
  })

  test('flags without value should be boolean', () => {
    const args = ['--active', '--port', '8080', '--cwd', '.']
    deepStrictEqual(parse(args), {active: true, port: 8080, cwd: '.'})
  })

  test('flags without value should be boolean', () => {
    const args = ['--port', '8080', '--cwd', '.', '--active']
    deepStrictEqual(parse(args), {active: true, port: 8080, cwd: '.'})
  })

  test('parses multiple flag ignoring not paired options', () => {
    const args = ['--port', '8080', '--cwd', '.', '12']
    deepStrictEqual(parse(args), {port: 8080, cwd: '.'})
  })

  test('ignores items that not starts with --', () => {
    const args = ['should', 'be', 'ignored', '--port', '8080', '--cwd', '.']
    deepStrictEqual(parse(args), {port: 8080, cwd: '.'})
  })

  test('empty option if no flags', () => {
    const args = ['should', 'be', 'ignored']
    deepStrictEqual(parse(args), {})
  })
})
