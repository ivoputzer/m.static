const {createReadStream} = require('fs')
const {createServer} = require('http')
const {join, normalize} = require('path')
const {stringify} = JSON

function createFileServer (options) {
  if (!options) throw new Error('options are mandatory')
  return createServer(requestHandlerFor(options))
}

function requestHandlerFor (options) {
  return (req, res) => {
    const filename = join(options.cwd, normalize(req.url))
    createReadStream(filename)
      .on('error', errorHandlerFor(req, res, options))
      .pipe(res)
  }
}

function errorHandlerFor (req, res, options) {
  return (err) => {
    if (err.errno === -21) {
      res.writeHead(301, {
        'Location': `/${options.defaultFile}`
      })
      res.end()
    } else {
      res.end(stringify(err))
    }
  }
}

module.exports = {createFileServer}
