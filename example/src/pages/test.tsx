import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  chakra,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { connectPage, Field } from "@snek-at/jaen"
import { graphql } from "gatsby"

export default connectPage(
  () => {
    const TestCard: React.FC<{
      children: JSX.Element
      heading: string
      text: string
      price: string
    }> = props => {
      return (
        <Card maxW="sm" as={WrapItem}>
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">{props.heading}</Heading>
              <Text>{props.text}</Text>
              <Text color="blue.600" fontSize="2xl">
                {props.price}
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing="2">
              <Button variant="solid" colorScheme="blue">
                Buy now
              </Button>
              <Button variant="ghost" colorScheme="blue">
                Add to cart
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      )
    }

    TestCard.defaultProps = {
      heading: "Couch",
      text: "A green couch with wooden legs",
      price: "$299",
    }

    return (
      <Box mx="96">
        <Field.Mdx
          name="test"
          components={{
            p: props => <chakra.p fontSize="sm" color="red" {...props} />,
            h1: props => (
              <chakra.h1
                fontSize="2xl"
                borderBottom="1px solid blue"
                {...props}
              />
            ),
            h2: props => <chakra.h2 fontSize="xl" color="aqua" {...props} />,
            h3: props => <chakra.h3 fontSize="lg" {...props} />,
            h4: props => <chakra.h4 fontSize="md" {...props} />,
            TestCard,
            Wrap,
          }}
        />
      </Box>
    )
  },
  {
    label: "Test",
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
