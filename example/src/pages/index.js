import * as React from "react"
import { Button, Box, Image, Badge, Wrap, WrapItem } from "@chakra-ui/react"
import { StarIcon } from "@chakra-ui/icons"
import { connectPage, Field, useWidget, connectBlock } from "@snek-at/jaen"

import { graphql } from "gatsby"

const Card = connectBlock(
  () => {
    const property = {
      imageUrl: "https://bit.ly/2Z4KKcF",
      imageAlt: "Rear view of modern home with pool",
      beds: 3,
      baths: 2,
      title: "Modern home in city center in the heart of historic Los Angeles",
      formattedPrice: "$1,900.00",
      reviewCount: 34,
      rating: 4,
    }

    return (
      <Box w="sm" borderWidth="1px" borderRadius="lg">
        {/* <Image src={property.imageUrl} alt={property.imageAlt} /> */}

        <Box h="md" m="4">
          <Field.Image
            name="image"
            label="Image"
            // defaultValue={property.imageUrl}
          />
        </Box>

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {property.beds} beds &bull; {property.baths} baths
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            // lineHeight="tight"
            noOfLines={1}
          >
            <Field.Text
              name="title"
              label="Title"
              defaultValue={property.title}
            />
          </Box>

          <Box>
            {property.formattedPrice}
            <Box as="span" color="gray.600" fontSize="sm">
              / wk
            </Box>
          </Box>

          <Box display="flex" mt="2" alignItems="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < property.rating ? "teal.500" : "gray.300"}
                />
              ))}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {property.reviewCount} reviews
            </Box>
          </Box>
        </Box>
      </Box>
    )
  },
  { name: "card", label: "House Card" }
)

const IndexPage = connectPage(
  () => {
    const menuWidget = useWidget("menu")

    React.useEffect(() => {
      console.log(menuWidget.data)

      menuWidget.writeData({
        items: [
          {
            label: "Home",
            url: "/",
          },
        ],
      })
    }, [])

    return (
      <>
        <Field.Section
          name="section"
          label="Section"
          blocks={[Card]}
          as={Wrap}
          sectionAs={WrapItem}
        />
        <div style={{ color: `purple`, fontSize: `72px`, height: "5000px" }}>
          <h1>Hello Gatsby!</h1>
          <p>Now go build something great.</p>
          <Button colorScheme="teal">Button</Button>
          <Field.Text name="test" defaultValue={"teest"} label="Test" />
        </div>
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
