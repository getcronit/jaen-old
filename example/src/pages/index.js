import * as React from "react"
import { Button } from "@chakra-ui/react"
import { useSite } from "./useSite"

const IndexPage = () => {
  const data = useSite()

  return (
    <div style={{ color: `purple`, fontSize: `72px`, height: "5000px" }}>
      <h1>Hello Gatsby!</h1>
      <p>Now go build something great.</p>
      <Button colorScheme="teal">Button</Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default IndexPage
