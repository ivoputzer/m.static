exports.parse = (args) => {
  return reduceToKeyValues(args, {})
}

function reduceToKeyValues (args, options) {
  if (args.length === 0) return options

  let key = args[0]
  let value = args[1]

  if (isValidFlag(key)) {
    options[parseFlag(key)] = parseValue(value)
  }

  return reduceToKeyValues(nextArgs(args), options)
}

function nextArgs (args) {
  return isValidValue(args[1]) ? args.slice(2) : args.slice(1)
}

function isValidFlag (key) {
  return key.indexOf('--') === 0
}

function isValidValue (value) {
  return value && !isValidFlag(value)
}

function parseFlag (key) {
  return key.slice(2)
}

function parseValue (value) {
  if (!isValidValue(value)) return true

  return isNaN(value) ? value : parseInt(value)
}
