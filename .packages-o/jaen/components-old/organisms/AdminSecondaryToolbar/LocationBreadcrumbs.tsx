import {ChevronRightIcon} from '@chakra-ui/icons'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, Tag} from '@chakra-ui/react'
import {useEffect, useState} from 'react'

export function LocationBreadcrumbs() {
  // Get breadcrumbs from location hash
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{
      name: string
      path: string
      isLast: boolean
    }>
  >([])

  useEffect(() => {
    const hash = window.location.hash.split('#')[1]
    const hashParts = hash?.split('/').filter(part => part !== '') || []

    const newBreadcrumbs = hashParts.map((part, index) => {
      const isLast = index === hashParts.length - 1
      const path = hashParts.slice(0, index + 1).join('/')

      return {
        path,
        name: part,
        isLast
      }
    })

    setBreadcrumbs(newBreadcrumbs)
  }, [window.location.hash])

  return (
    <Breadcrumb
      spacing="1"
      separator={<ChevronRightIcon color="gray.500" />}
      fontSize="sm">
      {breadcrumbs.length > 0 ? (
        breadcrumbs.map(breadcrumb => (
          <BreadcrumbItem key={breadcrumb.path}>
            <BreadcrumbLink
              href={`#/${breadcrumb.path}`}
              textTransform="capitalize">
              <Tag colorScheme={breadcrumb.isLast ? 'gray' : 'pink'}>
                {breadcrumb.name}
              </Tag>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))
      ) : (
        <BreadcrumbItem key="/">
          <BreadcrumbLink href="#/" textTransform="capitalize">
            <Tag colorScheme="gray">Home</Tag>
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  )
}
