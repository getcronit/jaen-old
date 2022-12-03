import {GatsbyConfig as GatsbyConfigType} from 'gatsby'

import {JaenSource} from '@snek-at/jaen/unstable-node'

const GatsbyConfig: GatsbyConfigType = {
  jsxRuntime: 'automatic',
  jsxImportSource: '@emotion/react',
  siteMetadata: JaenSource.jaenData.internal?.site.siteMetadata
}

GatsbyConfig.plugins = [
  {
    resolve: `gatsby-plugin-compile-es6-packages`,
    options: {
      modules: [`@chakra-ui/gatsby-plugin`]
    }
  },
  'gatsby-plugin-react-helmet-async',
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      defaults: {
        formats: [`auto`, `webp`],
        placeholder: `dominantColor`,
        quality: 50,
        breakpoints: [750, 1080, 1366, 1920],
        backgroundColor: `transparent`,
        tracedSVGOptions: {},
        blurredOptions: {},
        jpgOptions: {},
        pngOptions: {},
        webpOptions: {},
        avifOptions: {}
      }
    }
  },
  `gatsby-transformer-sharp`,
  `gatsby-plugin-image`
]

const addSourcePluginIfPathExists = (
  plugins: GatsbyConfigType['plugins'] = [],
  options: {
    name: string
    path: string | null
  }
) => {
  if (options.path) {
    plugins.push({
      resolve: 'gatsby-source-filesystem',
      options: {
        name: options.name,
        path: options.path,
        ignore: [`**/.gitkeep`]
      }
    })
  }
}

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-pages',
  path: JaenSource.sourcePagesPath
})

addSourcePluginIfPathExists(GatsbyConfig.plugins, {
  name: 'jaen-templates',
  path: JaenSource.sourceTemplatesPath
})

export default GatsbyConfig
