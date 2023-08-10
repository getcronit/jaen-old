import {GatsbyConfig} from 'gatsby'
import fs from 'fs'

const Config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-source-jaen`
  ]
}

export const templateDir = `${process.cwd()}/src/templates`

if (fs.existsSync(templateDir)) {
  Config.plugins?.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `templates`,
      path: templateDir
    }
  })
}

export default Config
