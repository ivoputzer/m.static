exports.parse = (args) => {
  return reduceToKeyValues(args, {})
}

function reduceToKeyValues (values, out) {
  let key = keyFrom(values)
  if (!key) return out

  out[key] = values.shift()

  return reduceToKeyValues(values, out)
}

function keyFrom (values) {
  let key = values.shift()

  if (!key)        return null
  if (isFlag(key)) return parseFlag(key)

  return keyFrom(values)
}

function parseFlag (key) {
  return key.slice(2)
}

function isFlag (key) {
  return key.indexOf('--') === 0
}

function tooFew (values) {
  return values.length < 2
}
