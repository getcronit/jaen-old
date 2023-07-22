const {useGatsbyNode} = require('gatsby-plugin-ts-config')

module.exports = useGatsbyNode(() => require('./gatsby/gatsby-node'), {
  type: 'ts-node',
  transpilerOptions: {
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
      target: 'es2020'
    }
  }
})
