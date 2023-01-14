import {EditIcon} from '@chakra-ui/icons'
import {Badge, Button, IconButton, useBreakpointValue} from '@chakra-ui/react'

import {useEdit} from './useEdit.js'

export interface EditActionButtonProps {}

export const EditActionButton: React.FC<EditActionButtonProps> = () => {
  const isMobile = useBreakpointValue(
    {base: true, lg: false},
    {
      ssr: false
    }
  )

  const {isEditing, toggleEditing} = useEdit()

  if (isMobile) {
    return (
      <IconButton
        onClick={toggleEditing}
        display={{base: 'flex', lg: 'none'}}
        borderRadius="full"
        icon={<EditIcon />}
        aria-label={`Edit ${isEditing ? 'off' : 'on'}`}
      />
    )
  }

  return (
    <Button
      onClick={toggleEditing}
      display={{base: 'none', lg: 'flex'}}
      borderRadius="full"
      leftIcon={<EditIcon />}
      rightIcon={
        isEditing ? (
          <Badge rounded="full" colorScheme="green">
            On
          </Badge>
        ) : (
          <Badge rounded="full">Off</Badge>
        )
      }>
      Edit
    </Button>
  )
}
