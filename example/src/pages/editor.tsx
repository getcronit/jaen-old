import { Box } from "@chakra-ui/react"
import { connectPage, Editor } from "@snek-at/jaen"
import { graphql } from "gatsby"

export default connectPage(
  () => {
    return (
      <Box m="8">
        <Editor />
      </Box>
    )
  },
  {
    label: "Editor",
  }
)

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`
