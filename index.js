const {createReadStream} = require('fs')
const {createServer} = require('http')
const {join, normalize} = require('path')
const {parse} = require('url')
const {stringify} = JSON

function createFileServer (options) {
  if (!options) throw new Error('options are mandatory')
  let handler = new RequestHandler(options)

  return createServer((req, res) => handler.handle(req, res))
}

class RequestHandler {
  constructor (options) {
    this.options = options
  }

  handle (req, res) {
    this.req = req
    this.res = res

    const filename = join(this.options.cwd, normalize(this.req.url))
    this.readStream(filename)
  }

  error (err) {
    if (err.code === 'EISDIR') {
      return this.readStream(this.defaultFilePath())
    }

    if (err.code === 'ENOENT') {
      this.res.writeHead(404)
      return this.readStream(this.errorFilePath())
    }

    this.res.end(stringify(err))
  }

  readStream (filename) {
    createReadStream(filename)
      .on('error', (err) => this.error(err))
      .pipe(this.res)
  }

  errorFilePath () {
    return join(this.options.cwd, this.options.errorFilePath)
  }

  defaultFilePath () {
    const {pathname} = parse(this.req.url)
    return join(this.options.cwd, pathname, this.options.defaultFile)
  }
}

module.exports = {createFileServer}
