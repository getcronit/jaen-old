import {JaenPage, JaenSite} from '@snek-at/jaen'
import {SourceNodesArgs, Node} from 'gatsby'
import fs from 'fs/promises' // Import the fs module for asynchronous file operations

import {fetchMergeData} from '../utils/fetch-and-merge'

export type JaenData = {
  pages?: JaenPage[]
  site?: JaenSite
  patches?: any
}

export const sourceNodes = async (args: SourceNodesArgs) => {
  const {actions, createNodeId, createContentDigest, reporter} = args
  const {createNode} = actions

  // Log a message using the reporter
  reporter.info('Fetching and sourcing nodes...')

  try {
    // 1. Read data from ./jaen-data/data.json using fs
    const jsonDataBuffer = await fs.readFile(
      `${process.cwd()}/jaen-data/patches.json`
    )
    const jsonData = JSON.parse(jsonDataBuffer.toString())

    // 2. Fetch and merge additional data using fetchMergeData function
    const merged = await fetchMergeData<{
      data: {
        pages?: JaenPage[]
        site?: JaenSite
      }
    }>(jsonData)

    console.log(merged)

    const data = {
      pages: merged.data.pages || [],
      site: merged.data.site || {},
      patches: jsonData || []
    }

    // 3. Create JaenData node
    const jaenDataNode = {
      id: createNodeId('JaenData'),
      internal: {
        type: 'JaenData',
        contentDigest: createContentDigest(data)
      },
      ...data
    }

    // 4. Create JaenData node using createNode action
    createNode(jaenDataNode)

    // Log a success message using the reporter
    reporter.info('Nodes sourced and created successfully!')
  } catch (error) {
    // Log an error message using the reporter
    reporter.panic('Error sourcing nodes:', error)
  }
}
