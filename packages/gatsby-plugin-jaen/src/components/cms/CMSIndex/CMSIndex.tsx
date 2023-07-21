import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
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
