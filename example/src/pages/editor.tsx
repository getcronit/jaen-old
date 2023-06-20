import { Box } from "@chakra-ui/react"
import { connectBlock, connectPage, Editor, Field } from "@snek-at/jaen"
import { graphql } from "gatsby"

const ImageBlock = connectBlock(
  () => {
    return (
      <Box borderRadius={"lg"} overflow="hidden" boxSize={"lg"}>
        <Field.Image name="image" />
      </Box>
    )
  },
  {
    label: "ImageBlock",
    name: "ImageBlock",
  }
)

export default connectPage(
  () => {
    return (
      <Box m="8">
        <Editor blocks={[ImageBlock]} />
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
