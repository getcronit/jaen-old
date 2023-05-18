import { StarIcon } from "@chakra-ui/icons"
import {
  Box,
  Badge,
  Wrap,
  WrapItem,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react"

import { connectBlock, connectPage, Field, useWidget } from "@snek-at/jaen"
import * as React from "react"

import { graphql, Link } from "gatsby"

const IndexPage = connectPage(
  function () {
    return (
      <>
        <Field.Text
          as={Heading}
          asAs="h1"
          name="hhhh"
          defaultValue="Heading1"
        />

        <Button as={Link} to="#heading2">
          Button 1234 #heading2
        </Button>

        <Field.Text
          as="h1"
          name="valueheading"
          defaultValue="Heading1"
          idStrategy="value"
        />

        <Field.Text as={"h1"} name="heading" defaultValue="Heading1" />
        <Field.Text name="text" defaultValue="Text..." relatedName="heading" />

        <a href="#content">Link</a>

        <Link to="#content">Gatsby Link</Link>

        <Box h="5000px" bg="red"></Box>
        <h1 id="content">Heading</h1>

        <Box h="5000px" bg="green"></Box>

        <Field.Text name="heading2" defaultValue="Heading2" />

        <Field.Image name="image" defaultValue={undefined} />

        <Field.RichText name="richtext" defaultValue="Rich Text" my="24" />
      </>
    )
  },
  {
    label: "IndexPage",
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
export { Head } from "@snek-at/jaen"
