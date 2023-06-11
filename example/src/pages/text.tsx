import { connectPage, Field } from "@snek-at/jaen"

import { graphql } from "gatsby"

const IndexPage = connectPage(
  function () {
    return (
      <>
        <Field.Text
          name="valueheading"
          defaultValue="Heading1"
          idStrategy="value"
          m="4"
        />
      </>
    )
  },
  {
    label: "TextPage",
    children: ["Text"],
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
export { Head } from "@snek-at/jaen"
