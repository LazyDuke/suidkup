module.exports = function (context, { typesript = false }) {
  const presets = []
  const plugins = [
    [require('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    [require('@babel/plugin-proposal-private-methods'), { loose: true }],
    require('@babel/plugin-proposal-nullish-coalescing-operator'),
    [require('@babel/plugin-proposal-optional-chaining'), { loose: true }],
    require('@babel/plugin-transform-runtime')
  ]
  const babelPresetsEnvOptions = {
    modules: false
  }

  if (process.env.NODE_ENV === 'test') {
    Object.assign(babelPresetsEnvOptions, {
      modules: 'auto',
      targets: {
        node: 'current'
      }
    })
  }

  presets.push([require('@babel/preset-env'), babelPresetsEnvOptions])

  if (typesript) {
    presets.push(require('@babel/preset-typescript'))

    return { presets }
  }

  return { presets, plugins }
}
