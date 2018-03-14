const {ok} = require('assert')
const {createServer} = require('../..')

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
