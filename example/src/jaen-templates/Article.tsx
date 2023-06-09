import { Button, ChakraProvider } from "@chakra-ui/react"
import { Field } from "@snek-at/jaen"
import { connectTemplate } from "@snek-at/jaen"

export default connectTemplate(
  () => {
    return (
      <>
        <h1>Blog</h1>

        <Button>Tewst2</Button>

        <ChakraProvider>
          <Field.RichText name="article" w="full" bg="red.100" />
        </ChakraProvider>
      </>
    )
  },
  {
    label: "Simple Blog Page",
    children: ["Article"],
  }
)
