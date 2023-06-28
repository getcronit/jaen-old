import { StarIcon } from "@chakra-ui/icons"
import {
  Box,
  Badge,
  Wrap,
  WrapItem,
  Button,
  Text,
  ButtonGroup,
} from "@chakra-ui/react"

import {
  connectBlock,
  connectPage,
  Field,
  useAuthentication,
  useJaenPageTree,
  useWidget,
} from "@snek-at/jaen"
import * as React from "react"

import { graphql, Link } from "gatsby"

const FullImageCard = connectBlock(
  () => {
    return (
      <Box
        boxSize="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow={"hidden"}
        borderColor="green"
      >
        <Field.Image name="image" lightbox />
      </Box>
    )
  },
  {
    name: "fullImageCard",
    label: "Full Image Card",
  }
)

const GrowOnHover = connectBlock(
  () => {
    return (
      <Box
        boxSize="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow={"hidden"}
        borderColor="green"
        _hover={{
          transform: "scale(1.5)",
          // transition: "all 0.2s ease-in-out",
        }}
      >
        <Field.Image name="image" />
      </Box>
    )
  },
  {
    name: "growOnHover",
    label: "Grow On Hover",
  }
)

const RotatedBox = connectBlock(
  () => {
    return (
      <Box
        boxSize="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow={"hidden"}
        borderColor="green"
        transform="rotate(45deg)"
        p="4"
      >
        <Field.Image name="image" />
      </Box>
    )
  },
  {
    name: "rotatedBox",
    label: "Rotated Box",
  }
)

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
      <Box
        w="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow={"hidden"}
        borderColor="green"
      >
        {/* <Image src={property.imageUrl} alt={property.imageAlt} /> */}

        <Box h="md" m="4">
          <Field.Image
            name="image"
            overload
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
            // lineHeight="tight"
            noOfLines={1}
          >
            <Field.Text name="title" defaultValue={property.title} />
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
  function () {
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

    const auth = useAuthentication()

    const aaaa = useJaenPageTree()

    console.log(`aaaa`, aaaa)

    return (
      <>
        <Field.Text name="test" defaultValue="test" isRTF={false} />

        {auth.isAuthenticated ? (
          <Button onClick={() => auth.logout()}>Logout</Button>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()

              // @ts-expect-error
              const username = e.target.username.value
              // @ts-expect-error
              const password = e.target.password.value

              auth.login(username, password)
            }}
          >
            <input type="text" name="username" />
            <input type="password" name="password" />
            <ButtonGroup>
              <Button type="submit" variant="link">
                Login
              </Button>

              <Button
                onClick={() => {
                  auth.demoLogin()
                }}
                variant="link"
              >
                Demo
              </Button>
            </ButtonGroup>
          </form>
        )}

        {auth.isAuthenticated ? (
          <Button onClick={() => auth.logout()}>Logout</Button>
        ) : (
          "You are not signed in"
        )}

        <Button as={Link} to="/">
          Home
        </Button>

        <Button as={Link} to="/article">
          Article
        </Button>

        <Button as={Link} to="/xxxx">
          Button 1234 /xxxx
        </Button>
        <Button>Button 1234</Button>
        <Button>Button 12342232323231</Button>
        <Button>Button 111323</Button>
        <Button>Button 111323</Button>

        <Box maxH="sm">
          <img src="https://i.giphy.com/media/duzpaTbCUy9Vu/giphy.webp" />
        </Box>

        <Field.Text
          as={Button}
          asAs="span"
          name="textButton"
          defaultValue="textButton"
        ></Field.Text>

        <Box minW="sm" minH="sm">
          <Field.Image
            name="image0"
            overload
            defaultValue={"https://i.giphy.com/media/duzpaTbCUy9Vu/giphy.webp"}
          />
        </Box>

        <Box minW="sm" minH="sm" maxW="500px" bg="green">
          <Field.Image
            name="image2"
            defaultValue="https://via.placeholder.com/300x200"
          />
        </Box>

        <Button>Button 2</Button>
        <Field.Section
          name="section"
          label="Section"
          blocks={[Card, FullImageCard, RotatedBox, GrowOnHover]}
          as={Wrap}
          sectionAs={WrapItem}
          sectionProps={{
            ref: (el: any) => console.log("ELEMENT", el),
            color: "red",
          }}
        />
        <div
          style={{ color: `purple`, fontSize: `72px`, height: "5000px" }}
          id="app"
        >
          <h1>Hello Gatsby!</h1>
          <p>Now go build something great.</p>
          <Button>Button 3</Button>
          <Field.Text name="test" defaultValue="teest" />

          <Text fontFamily={"fantasy"} as="span">
            <Field.Text name="custom-font" defaultValue="Fantasyyyy" />
          </Text>
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
