import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button
} from '@chakra-ui/react'
import {Link} from 'gatsby'

export interface BreadcrumbsProps {
  links: Array<{
    label: string
    path?: string
    onClick?: () => void
  }>
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({links}) => {
  return (
    <Breadcrumb>
      {links.map((link, index) => {
        const isCurrentPage = index === links.length - 1

        return (
          <BreadcrumbItem
            key={index}
            as={Button}
            variant="ghost"
            p="2"
            onClick={link.onClick}>
            <BreadcrumbLink
              as={link.path ? Link : undefined}
              to={link.path}
              isCurrentPage={isCurrentPage}
              fontWeight={isCurrentPage ? 'bold' : 'normal'}
              textDecoration="none">
              {link.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
