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
      cwd: join(__dirname, '..', 'www'),
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
