import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  StackDivider,
  Text
} from '@chakra-ui/react'
import {Link} from '../../shared/Link'

export interface CMSIndexProps {
  pages: Array<{
    title: string
    description: string
    path?: string
    onClick?: () => void
  }>
}

export const CMSIndex: React.FC<CMSIndexProps> = props => {
  return (
    <SimpleGrid columns={[2, null, 3]} spacing="40px">
      {props.pages.map((page, index) => (
        <Card key={index}>
          <CardHeader>
            <Heading size="xs">
              <Link to={page.path}>{page.title}</Link>
            </Heading>
          </CardHeader>

          <CardBody>{page.description}</CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )

  return (
    <Card>
      <CardHeader>
        <Heading size="xs">Jaen CMS </Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {props.pages.map((page, index) => (
            <Box key={index}>
              <Link to={page.path}>{page.title}</Link>
              <Text pt="2" fontSize="sm">
                {page.description}
              </Text>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  )
}
