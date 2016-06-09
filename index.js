const encoding = 'utf8'

const {createReadStream} = require('fs')
const {createServer} = require('http')
const {join, normalize} = require('path')
const {stringify} = JSON

function static(options){
  if (!options) throw new Error('options are mandatory')
  return createServer(requestHandlerFor(options))
}

function requestHandlerFor(options){
  return (req, res) => {
    const filename = join(options.cwd, normalize(req.url))
    createReadStream(filename)
      .on('error', errorHandlerFor(req, res))
      .pipe(res)
  }
}

function errorHandlerFor(req, res){
  return (err) => {
    res.end(stringify(err))
  }
}

module.exports = {static}
