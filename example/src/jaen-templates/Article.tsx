import { connectTemplate } from "@snek-at/jaen"

export default connectTemplate(
  () => {
    return (
      <>
        <h1>Blog</h1>
      </>
    )
  },
  {
    displayName: "Simple Blog Page",
    children: ["Article"],
  }
)
