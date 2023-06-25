import { connectPage, Field, SearchProvider } from "@snek-at/jaen"

import { graphql } from "gatsby"
import { Search } from "../components/Search"

const SearchDemoPage = connectPage(
  function () {
    return (
      <>
        <SearchProvider>
          <Search />
        </SearchProvider>

        <Field.Text name="title" defaultValue="Field on Search Page" />
      </>
    )
  },
  {
    label: "SearchDemo",
    children: [],
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
export default SearchDemoPage
export { Head } from "@snek-at/jaen"
