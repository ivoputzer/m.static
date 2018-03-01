const {createFileServer} = require('..')
const {get} = require('http')
const {equal, throws, notEqual} = require('assert')
const {test} = require('m.test')

test('m.icro', function () {
  test('uses standard module loading', () => {
    let module = require('..')
    notEqual(module.createFileServer, undefined)
  })
})

test('m.createFileServer', function () {
  test('throws an error when no options are given', () => {
    throws(createFileServer, Error)
  })

  const server = createFileServer({cwd: __dirname})

  test('exposes a `listen` fn as of net.Server', () => {
    equal(typeof server.listen, 'function')
  })

  test('exposes a `close` fn as of net.Server', () => {
    equal(typeof server.close, 'function')
  })

  test('loads createFileServer files within `cwd`', (done) => {
    server.listen(9999, () => {
      get('http://localhost:9999/index.html', (res) => {
        equal(200, res.statusCode)
        server.close(done)
      })
    })
  })
})
