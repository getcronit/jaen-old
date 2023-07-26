import {
  Button,
  Heading,
  HStack,
  Stack,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import {FaPlus} from 'react-icons/fa'

import React from 'react'
import {Link} from '../../shared/Link'
import {PageContentForm} from './shared/PageContentForm/PageContentForm'
import {PageVisualizer} from './shared/PageVisualizer/PageVisualizer'
import {IJaenPage} from '@snek-at/jaen'

export interface PagesProps {
  page: IJaenPage
  children: Array<{
    title: string
    description: string
    publishedDate: string
    lastModifiedDate?: string
    author?: string
  }>
}

export const Pages: React.FC<PagesProps> = props => {
  return (
    <Stack id="coco" flexDir="column" spacing="14">
      <Stack spacing="4" divider={<StackDivider />}>
        <PageContentForm
          mode="edit"
          onSubmit={data => {
            console.log(data)
          }}
          values={{
            title: props.page.jaenPageMetadata.title,
            slug: props.page.slug,
            template: props.page.template,
            description: props.page.jaenPageMetadata.description
          }}
          templates={{}}
          parentPages={{}}
        />

        <PageVisualizer />
      </Stack>

      <Stack spacing="4" divider={<StackDivider />}>
        <HStack justifyContent="space-between">
          <Heading as="h2" size="sm">
            Subpages
          </Heading>

          <Link as={Button} to="new" leftIcon={<FaPlus />} variant="outline">
            New page
          </Link>
        </HStack>

        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Author</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.children.map((page, index) => (
              <Tr key={index}>
                <Td>
                  <Link to={`?page=${page.title.toLowerCase()}`}>
                    {page.title}
                  </Link>
                </Td>
                <Td>{page.description}</Td>
                <Td>
                  {page.author ? (
                    <Link>By {page.author}</Link>
                  ) : (
                    `System generated`
                  )}
                </Td>
                <Td whiteSpace="break-spaces">
                  {page.lastModifiedDate
                    ? `Last modified ${new Date(
                        page.lastModifiedDate
                      ).toLocaleDateString('en-US')} at ${new Date(
                        page.lastModifiedDate
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`
                    : `Published ${new Date(
                        page.publishedDate
                      ).toLocaleDateString('en-US')} at ${new Date(
                        page.publishedDate
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  )
}
