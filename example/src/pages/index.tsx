import { Button, LightMode } from "@chakra-ui/react"
import { useAuthentication } from "@snek-at/jaen"

const IndexPage = () => {
  const auth = useAuthentication()

  return (
    <LightMode>
      <div>
        <Button variant="outline" onClick={auth.openLoginModal}>
          Login
        </Button>

        <iframe
          src="https://www.youtube.com/embed/2g811Eo7K8U"
          width="560"
          height="315"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="video"
        />
      </div>
    </LightMode>
  )
}

export default IndexPage
