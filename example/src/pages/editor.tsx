import { Box } from "@chakra-ui/react"
import { connectBlock, connectPage, Editor, Field } from "@snek-at/jaen"
import { graphql } from "gatsby"

const ImageBlock = connectBlock(
  () => {
    return (
      <Box boxShadow="light" overflow="hidden" borderRadius="lg">
        <Field.Image name="image" />
      </Box>
    )
  },
  {
    label: "ImageBlock",
    name: "ImageBlock",
  }
)

const AAAA = connectBlock(
  () => {
    return (
      <Box boxShadow="light" overflow="hidden">
        <Field.Image name="image" />
      </Box>
    )
  },
  {
    label: "AAAA",
    name: "AAAA",
  }
)

export default connectPage(
  () => {
    return (
      <Box m="8">
        <Editor blocks={[AAAA, ImageBlock]} />
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
