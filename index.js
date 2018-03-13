const {createReadStream} = require('fs')
const {join, normalize} = require('path')
const {parse} = require('url')

function createRequestListener (options) {
  if (!options) throw new Error('options are mandatory')
  // todo: check options and set default options here

  return function requestListener (req, res) {
    const requestFile = join(options.cwd, req.url)
    const defaultFile = join(options.cwd, req.url, options.defaultFile)
    const errorFile = join(options.cwd, options.errorFile)

    return createReadStream(requestFile)
      .on('error', handleError)
      .pipe(res)

    function handleError (err) {
      if (err.code === 'EISDIR') {
        createReadStream(defaultFile)
          .on('error', handleError)
          .pipe(res)
      } else if (err.code === 'ENOENT') {
        res.writeHead(404)
        createReadStream(errorFile)
          .on('error', handleError)
          .pipe(res)
      } else {
        res.end(JSON.stringify(err))
      }
    }
  }
}

module.exports = {createRequestListener}
