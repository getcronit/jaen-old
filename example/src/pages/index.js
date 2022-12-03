import * as React from "react"
import { Button } from "@chakra-ui/react"
import { connectPage } from "@snek-at/jaen"

import { useSite } from "./useSite"
import { graphql } from "gatsby"

const IndexPage = connectPage(
  () => {
    const data = useSite()

    return (
      <div style={{ color: `purple`, fontSize: `72px`, height: "5000px" }}>
        <h1>Hello Gatsby!</h1>
        <p>Now go build something great.</p>
        <Button colorScheme="teal">Button</Button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  },
  {
    displayName: "IndexPage",
    children: ["Article"],
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
export default IndexPage
