const {ok, equal, throws} = require('assert')
const {Writable} = require('stream')
const {join} = require('path')
const {readFileSync} = require('fs')
const {createRequestListener} = require('..')

test('exports.createRequestListener', () => {
  test('is callable', () => {
    ok(createRequestListener instanceof Function)
  })

  test('throws an error when no options are provided', () => {
    throws(createRequestListener, Error)
  })

  test('returns requestListener', () => {
    const requestListener = createRequestListener({
      cwd: join(__dirname, '../www'),
      defaultFile: 'index.html',
      errorFile: '404.html'
    })

    test('is callable', () => {
      ok(requestListener instanceof Function)
    })

    test('responds 200 when pathname exists', done => {
      const expected = join(__dirname, '../www/index.html')
      request('/index.html').on('finish', function () {
        equal(this.body, readFileSync(expected))
        done()
      })
    })

    test('responds 200 defaultFile when pathname is directory', done => {
      const expected = join(__dirname, '../www/index.html')
      request('/').on('finish', function () {
        equal(this.body, readFileSync(expected))
        done()
      })
    })

    test('responds 404 errorFile when pathname does not exist', done => {
      const expected = join(__dirname, '../www/404.html')
      request('/does-not-exist').on('finish', function () {
        equal(this.body, readFileSync(expected))
        done()
      })
    })

    test.skip('responds with error json on every other error', done => {
      request('/forbidden.html').on('finish', function () {
        equal(JSON.parse(this.body).code, 'EACCES')
        done()
      })
    })

    function request (url) {
      const body = []
      const req = {url}
      const res = new Writable({
        write (chunk, enc, done) {
          body.push(chunk)
          this.body = Buffer.concat(body).toString('utf8')
          done()
        }
      })
      res.writeHead = Function.prototype
      requestListener(req, res)
      return res
    }
  })
})

const {createServer} = require('..')

test('exports.createRequestListener', () => {
  const http = require('http')
  const https = require('https')

  test('is callable', () => {
    ok(createServer instanceof Function)
  })

  test('returns http.Server when cert and key options are missing', () => {
    ok(createServer(Function.prototype, {}) instanceof http.Server)
  })

  test('returns https.Server when cert and key options are provided', done => {
    const {createCertificate} = require('pem')
    createCertificate({days: 1, selfSigned: true}, function (err, {serviceKey: key, certificate: cert} = {}) {
      if (err) done(err)
      ok(createServer(Function.prototype, {cert, key}) instanceof https.Server)
      done()
    })
  })

  test.skip('returns https.Server when cert and key options are readable paths', Function.prototype)
})

const {deepStrictEqual} = require('assert')
const {parse} = require('../lib/args')

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
