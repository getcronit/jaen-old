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

const pages = [
  {
    title: 'Home',
    description:
      'Discover the latest fashion trends and shop for stylish clothing, accessories, and footwear. Stay ahead of the fashion curve with our curated collection.',
    childPages: 0,
    author: 'John Doe',
    publishedDate: '2023-07-01T12:00:00Z',
    lastModifiedDate: '2023-07-01T12:00:00Z',
    imageSrc:
      'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'Content',
    description:
      'Explore our web development, mobile development, design, and marketing services.',
    childPages: 4,
    author: 'Jane Smith',
    publishedDate: '2023-07-05T09:30:00Z',
    lastModifiedDate: '2023-07-05T09:30:00Z',
    imageSrc:
      'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'Grosshandel',
    description: 'Read our latest blog posts on various topics.',
    childPages: 0,
    publishedDate: '2023-07-10T15:45:00Z',
    imageSrc:
      'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'Wissen',
    description: 'Get answers to frequently asked questions.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z',
    lastModifiedDate: '2023-07-15T10:20:00Z',
    imageSrc:
      'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'FAQ',
    description: 'Get answers to frequently asked questions.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z',
    lastModifiedDate: '2023-07-15T10:20:00Z',
    imageSrc:
      'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    title: '404',
    description: 'Page not found.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z',
    lastModifiedDate: '2023-07-15T10:20:00Z'
  },
  {
    title: 'Impressum',
    description: 'Legal notice.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z',
    lastModifiedDate: '2023-07-15T10:20:00Z'
  },
  {
    title: 'Datenschutz',
    description: 'Data protection policy.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z'
  },
  {
    title: 'AGB',
    description: 'Terms and conditions.',
    childPages: 0,
    publishedDate: '2023-07-15T10:20:00Z'
  }
  // Add more pages as needed
]

export interface PagesProps {
  jaenPageId?: string
}

export const Pages: React.FC<PagesProps> = () => {
  return (
    <Stack id="coco" flexDir="column" spacing="14">
      <Stack spacing="4" divider={<StackDivider />}>
        <Stack>
          <Heading as="h2" size="sm">
            Overview
          </Heading>
          <Text color="fg.muted" fontSize="xs">
            This is the overview of all pages on your website. You can click on
            a page to navigate to it.
          </Text>
        </Stack>

        <PageVisualizer />
      </Stack>

      <PageContentForm
        mode="edit"
        onSubmit={data => {
          console.log(data)
        }}
        values={{
          title: 'Home',
          slug: 'home',
          template: 'HomeTemplate',
          description:
            'Discover the latest fashion trends and shop for stylish clothing, accessories, and footwear. Stay ahead of the fashion curve with our curated collection.'
        }}
      />

      <Stack spacing="4" divider={<StackDivider />}>
        <Heading as="h2" size="sm">
          Subpages
        </Heading>

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
            {pages.map((page, index) => (
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

        <HStack justifyContent="end">
          <Link as={Button} to="new" leftIcon={<FaPlus />} variant="outline">
            New page
          </Link>
        </HStack>
      </Stack>
    </Stack>
  )
}
