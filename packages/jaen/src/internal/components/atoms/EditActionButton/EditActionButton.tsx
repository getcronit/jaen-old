import {EditIcon} from '@chakra-ui/icons'
import {Badge, Button} from '@chakra-ui/react'

import {useEdit} from './useEdit.js'

export interface EditActionButtonProps {}

export const EditActionButton: React.FC<EditActionButtonProps> = () => {
  const {isEditing, toggleEditing} = useEdit()

  return (
    <Button
      onClick={toggleEditing}
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
