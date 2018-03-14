const {ok, equal, throws} = require('assert')
const {deepStrictEqual} = require('assert')

test('exports.createRequestListener', () => {
  const {readFileSync} = require('fs')
  const {createRequestListener} = require('..')

  test('is callable', () => {
    ok(createRequestListener instanceof Function)
  })

  test('throws an error when no options are provided', () => {
    throws(createRequestListener, Error)
  })

  test('returns requestListener', () => {
    const requestListener = createRequestListener({
      cwd: pathFor('www'),
      defaultFile: 'index.html',
      errorFile: '404.html'
    })

    test('is callable', () => {
      ok(requestListener instanceof Function)
    })

    test('responds 200 when pathname exists', done => {
      requestFor('/index.html')
        .on('finish', function () {
          equal(this.body, readFileSync(pathFor('www', 'index.html')))
          done()
        })
    })

    test('responds 200 defaultFile when pathname is directory', done => {
      requestFor('/')
        .on('finish', function () {
          equal(this.body, readFileSync(pathFor('www', 'index.html')))
          done()
        })
    })

    test('responds 404 errorFile when pathname does not exist', done => {
      requestFor('/does-not-exist')
        .on('finish', function () {
          equal(this.body, readFileSync(pathFor('www', '404.html')))
          done()
        })
    })

    test.skip('responds with error json on every other error', done => {
      requestFor('/forbidden.html')
        .on('finish', function ({parse} = JSON) {
          const {code} = parse(this.body)
          equal(code, 'EACCES')
          done()
        })
    })

    function pathFor (...paths) {
      const {join} = require('path')
      return join(__dirname, '..', ...paths)
    }

    function requestFor (url, headers = {}, body = []) {
      const {Writable} = require('stream')
      const res = new Writable({
        write (chunk, enc, done) {
          body.push(chunk)
          this.body = Buffer.concat(body).toString('utf8')
          done()
        }
      })
      requestListener({url, headers}, res)
      return Object.assign(res, {
        writeHead: Function.prototype
      })
    }
  })
})

test('exports.createServer', () => {
  const {createCertificate} = require('pem')
  const {createServer} = require('..')

  test('is callable', () => {
    ok(createServer instanceof Function)
  })

  test('returns http.Server when cert and key options are missing', () => {
    ok(createServer(Function.prototype, {}) instanceof require('http').Server)
  })

  test('returns https.Server when cert and key options are provided', done => {
    createCertificate({days: 1, selfSigned: true}, function (err, {serviceKey: key, certificate: cert} = {}) {
      if (err) done(err)
      ok(createServer(Function.prototype, {cert, key}) instanceof require('https').Server)
      done()
    })
  })

  test.skip('returns https.Server when cert and key options are readable paths', Function.prototype)
})

test('lib.args', () => {
  const {parse} = require('../lib/args')

  test('parses one flag', () => {
    const parsed = parse(['--cwd', '.'])
    deepStrictEqual(parsed, {cwd: '.'})
  })

  test('parses numeric flag', () => {
    const parsed = parse(['--port', '8080'])
    deepStrictEqual(parsed, {port: 8080})
  })

  test('parses multiple flag', () => {
    const parsed = parse(['--port', '8080', '--cwd', '.'])
    deepStrictEqual(parsed, {port: 8080, cwd: '.'})
  })

  test('flags without value should be boolean', () => {
    const parsed = parse(['--active', '--port', '8080', '--cwd', '.'])
    deepStrictEqual(parsed, {active: true, port: 8080, cwd: '.'})
  })

  test('flags without value should be boolean', () => {
    const parsed = parse(['--port', '8080', '--cwd', '.', '--active'])
    deepStrictEqual(parsed, {active: true, port: 8080, cwd: '.'})
  })

  test('parses multiple flag ignoring not paired options', () => {
    const parsed = parse(['--port', '8080', '--cwd', '.', '12'])
    deepStrictEqual(parsed, {port: 8080, cwd: '.'})
  })

  test('ignores items that not starts with --', () => {
    const parsed = parse(['should', 'be', 'ignored', '--port', '8080', '--cwd', '.'])
    deepStrictEqual(parsed, {port: 8080, cwd: '.'})
  })

  test('empty option if no flags', () => {
    const parsed = parse(['should', 'be', 'ignored'])
    deepStrictEqual(parsed, {})
  })
})
