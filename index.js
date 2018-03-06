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
  const {parse} = require('url')
  const {join} = require('path')
  const {pathname} = parse(req.url)
  return (err) => {
    if (err.code === 'EISDIR') {
      const filename = join(options.cwd, pathname, options.defaultFile)
      createReadStream(filename)
        .on('error', errorHandlerFor(req, res, options))
        .pipe(res)
    } else if (err.code === 'ENOENT') {
      const filename = join(options.cwd, options.errorFile)
      res.writeHead(404)
      createReadStream(filename)
        .on('error', errorHandlerFor(req, res, options))
        .pipe(res)
    } else {
      res.end(stringify(err))
    }
  }
}

module.exports = {createFileServer}
