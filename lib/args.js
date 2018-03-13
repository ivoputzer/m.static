exports.parse = (args) => {
  const out = {}
  for (let i = 0; i < args.length; i += 2) {
    out[args[i].slice(2)] = args[i + 1]
  }
  return out
}
