exports.parse = (args) => {
  return reduceToKeyValues(args, {})
}

function reduceToKeyValues (values, out) {
  if (values.length < 2) {
    return out
  }

  let key

  do {
    key = values.shift()
  } while (key.indexOf('--') !== 0 && values.length > 2)


  let value = values.shift()

  out[key.slice(2)] = value

  return reduceToKeyValues(values, out)
}


function __oldReduceToKeyValues (args, out) {
  let current = args.slice(0, 2)

  out[current[0].slice(2)] = current[1]

  let next = args.slice(2)
  return (next.length === 0) ? out : __oldReduceToKeyValues(next, out)
}
