const {static} = require('..')
const {get} = require('http')
const {equal, throws, notEqual} = require('assert')
const {join} = require('path')

describe('m.icro', function () {
  it('uses standard module loading', () => {
    let module = require('..')
    notEqual(module.static, undefined)
  })
})

describe('m.static', function(){
  it('throws an error when no options are given', () => {
    throws(static, Error)
  })

  const server = static({cwd: __dirname})

  before((done) => server.listen(9999, done))
  after((done) => server.close(done))

  it('exposes a `listen` fn as of net.Server', () => {
    equal(typeof server.listen, 'function')
  })

  it('exposes a `close` fn as of net.Server', () => {
    equal(typeof server.close, 'function')
  })

  it('loads static files within `cwd`', (done) => {
    get('http://localhost:9999/index.html', (res) => {
      equal(200, res.statusCode)
      done()
    })
  })
})
