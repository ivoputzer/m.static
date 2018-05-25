exports.createServer = (requestListener, options) => {
  const {createServer} = require('http')
  const {createServer: createSecureServer} = require('https')
  return options.hasOwnProperty('key') && options.hasOwnProperty('cert')
    ? createSecureServer(options, requestListener)
    : createServer(requestListener)
}

exports.createRequestListener = (options) => {
  const {join} = require('path')
  const {createReadStream} = require('fs')

  if (!options) throw new Error('options are mandatory')

  // todo: check options and set default options here

  return function requestListener (req, res) {
    const requestFile = join(options.cwd, req.url)
    const defaultFile = join(options.cwd, req.url, options.defaultFile)
    const errorFile = join(options.cwd, options.errorFile)

    return createReadStream(requestFile)
      .on('error', handleError)
      .pipe(res)

    function handleError (err, {stringify} = JSON) {
      if (err.code === 'EISDIR') {
        createReadStream(defaultFile)
          .on('error', handleError)
          .pipe(res)
      } else if (err.code === 'ENOENT' && err.path !== errorFile) {
        res.writeHead(404)
        createReadStream(errorFile)
          .on('error', handleError)
          .pipe(res)
      } else {
        res.end(stringify(err))
      }
    }
  }
}
