import {GatsbyConfig} from 'gatsby'
import fs from 'fs'

const Config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  plugins: []
}

export const pagesDir = `${process.cwd()}/src/pages`

if (fs.existsSync(pagesDir)) {
  Config.plugins?.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `pages`,
      path: pagesDir
    }
  })
}

export default Config
