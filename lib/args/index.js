exports.parse = (args) => {
  return reduceToKeyValues(args, {})
}

function reduceToKeyValues (args, options) {
  if (args.length === 0) {
    return options
  }

  let [key, value, ...otherArgs] = args

  if (isFlag(key) && isValue(value)) {
    options[parseFlag(key)] = parseValue(value)
    return reduceToKeyValues(otherArgs, options)
  }

  if (isFlag(key) && !isValue(value)) {
    options[parseFlag(key)] = true
  }

  return reduceToKeyValues(args.slice(1), options)
}

function isFlag (key) {
  return key.indexOf('--') === 0
}

function isValue (value) {
  return value && !isFlag(value)
}

function parseFlag (key) {
  return key.slice(2)
}

function parseValue (value) {
  return isNaN(value) ? value : parseInt(value)
}
