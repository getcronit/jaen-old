import {Button, Icon} from '@chakra-ui/react'
import React from 'react'
import {FaEdit} from 'react-icons/fa'

export interface EditButtonProps {
  isEditing: boolean
  onToggleEditing: () => void
}

export const EditButton: React.FC<EditButtonProps> = props => {
  const {isEditing, onToggleEditing} = props

  return (
    <Button
      size="sm"
      leftIcon={<Icon as={FaEdit} color="brand.500" />}
      onClick={onToggleEditing}>
      {isEditing ? 'Stop editing' : 'Edit'}
    </Button>
  )
}
