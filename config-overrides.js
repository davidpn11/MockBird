const { injectBabelPlugin, compose } = require('react-app-rewired')
const rewireMobX = require('react-app-rewire-mobx')
const rewireSass = require('react-app-rewire-scss')

const rootImport = [
  'babel-plugin-root-import',
  {
    rootPathSuffix: 'src',
    rootPathPrefix: '~',
  },
]

module.exports = compose(
  rewireMobX,
  rewireSass
)
module.exports = function override(config, env) {
  const rewires = compose(
    rewireMobX,
    rewireSass
  )

  config = injectBabelPlugin(rootImport, config)
  config = rewireMobX(config, env)

  return rewires(config, env)
}
