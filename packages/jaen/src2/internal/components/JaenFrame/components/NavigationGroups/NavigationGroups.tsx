import {
  As,
  Button,
  Icon,
  List,
  ListItem,
  Stack,
  StackDivider,
  Text
} from '@chakra-ui/react'
import {Link} from '../../../shared/Link/Link.js'

interface NavigationItem {
  icon: As
  label: string
  onClick?: () => void
  path?: string
}

interface NavigationGroup {
  label?: string
  items: Record<string, NavigationItem>
}

export interface NavigationGroupsProps {
  groups: Record<string, NavigationGroup>
}

export const NavigationGroups: React.FC<NavigationGroupsProps> = ({groups}) => {
  return (
    <Stack divider={<StackDivider borderColor="divider" />}>
      {Object.entries(groups).map(([key, value]) => {
        return (
          <Stack key={key}>
            {value.label && (
              <Text px="1" fontWeight="semibold" fontSize="sm" color="muted">
                {value.label}
              </Text>
            )}
            <List>
              {Object.entries(value.items).map(([key, value]) => {
                return (
                  <ListItem key={key}>
                    <Link
                      as={Button}
                      leftIcon={
                        <Icon
                          as={value.icon}
                          fontSize="lg"
                          mr="2"
                          color="icon"
                        />
                      }
                      variant="ghostSubtle"
                      w="full"
                      px="2"
                      justifyContent="flex-start"
                      fontWeight="medium"
                      fontSize="sm"
                      to={value.path}
                      onClick={value.onClick}>
                      {value.label}
                    </Link>
                  </ListItem>
                )
              })}
            </List>
          </Stack>
        )
      })}
    </Stack>
  )
}
