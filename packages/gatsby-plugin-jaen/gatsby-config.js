const {useGatsbyConfig} = require('gatsby-plugin-ts-config')

module.exports = useGatsbyConfig(() => require('./gatsby/gatsby-config'), {
  type: 'ts-node',
  transpilerOptions: {
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
      target: 'es2020'
    }
  }
})
