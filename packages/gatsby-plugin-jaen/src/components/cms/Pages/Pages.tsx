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
import {PageBreadcrumb} from './shared/PageBreadcrumb'
import {
  PageContentForm,
  PageContentFormProps
} from './shared/PageContentForm/PageContentForm'
import {TreeNode} from './shared/PageVisualizer'
import {PageVisualizer} from './shared/PageVisualizer/PageVisualizer'

export interface PagesProps {
  pageId: string
  form: PageContentFormProps
  children: Array<{
    id: string
    title: string
    description: string
    createdAt: string
    modifiedAt: string
    author?: string
  }>
  tree: Array<TreeNode>
  onTreeSelect?: (id: string) => void
  disableNewButton?: boolean
}

export const Pages: React.FC<PagesProps> = props => {
  return (
    <Stack id="coco" flexDir="column" spacing="14">
      <Stack spacing="4" divider={<StackDivider />}>
        <Stack spacing="4">
          <PageBreadcrumb tree={props.tree} activePageId={props.pageId} />

          <PageContentForm
            mode="edit"
            {...props.form}
            // onSubmit={data => {
            //   props.onPageUpdate(props.page.id, data)
            // }}
            // values={{
            //   title: props.page.jaenPageMetadata.title,
            //   slug: props.page.slug,
            //   template: props.page.template,
            //   description: props.page.jaenPageMetadata.description
            // }}
            // templates={{}}
            // parentPages={{}}
          />
        </Stack>

        <PageVisualizer
          tree={props.tree}
          selection={props.pageId}
          onSelect={props.onTreeSelect}
        />
      </Stack>

      <Stack spacing="4" divider={<StackDivider />}>
        <HStack justifyContent="space-between">
          <Heading as="h2" size="sm">
            Subpages
          </Heading>

          <Link
            isDisabled={props.disableNewButton}
            as={Button}
            to={`./new/#${btoa(props.pageId)}`}
            leftIcon={<FaPlus />}
            variant="outline">
            New page
          </Link>
        </HStack>

        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              {/* <Th>Author</Th> */}
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.children.map((page, index) => (
              <Tr key={index}>
                <Td>
                  <Link to={`#${btoa(page.id)}`}>{page.title}</Link>
                </Td>
                <Td>{page.description}</Td>
                {/* <Td>{page.author ? <Link>By {page.author}</Link> : `-`}</Td> */}
                <Td whiteSpace="break-spaces">
                  {page.createdAt || page.modifiedAt
                    ? page.modifiedAt && page.modifiedAt !== page.createdAt
                      ? `Last modified ${new Date(
                          page.modifiedAt
                        ).toLocaleDateString('en-US')} at ${new Date(
                          page.modifiedAt
                        ).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}`
                      : `Created ${new Date(page.createdAt).toLocaleDateString(
                          'en-US'
                        )} at ${new Date(page.createdAt).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}`
                    : '-'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  )
}
