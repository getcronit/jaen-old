import {ButtonGroup, Icon} from '@chakra-ui/react'
import {
  FaSitemap,
  FaCaretDown,
  FaDownload,
  FaTrash,
  FaGlobe
} from 'react-icons/fa'

import {MenuButton} from '../../shared/MenuButton'
import {EditButton} from './components/EditButton'

export interface ToolbarButtonsProps {
  // Props for the MenuButton with a single item
  pageTreeLabel: string
  pageTreeOnClick: () => void

  // Props for the EditButton
  editButtonIsEditing: boolean
  editButtonToggle: () => void

  // Props for the MenuButton with multiple items
  saveLabel: string
  saveOnClick: () => void
  discardLabel: string
  discardOnClick: () => void
  publishLabel: string
  publishOnClick: () => void
}

export const ToolbarButtons: React.FC<ToolbarButtonsProps> = props => {
  const {
    pageTreeLabel,
    pageTreeOnClick,
    editButtonIsEditing,
    editButtonToggle,
    saveLabel,
    saveOnClick,
    discardLabel,
    discardOnClick,
    publishLabel,
    publishOnClick
  } = props

  return (
    <ButtonGroup variant="outline">
      <MenuButton
        variant="outline"
        size="sm"
        leftIcon={<Icon as={FaSitemap} color="brand.500" />}
        rightIcon={<Icon as={FaCaretDown} />}
        renderItems={() => {
          return <>{pageTreeLabel}</>
        }}
        onClick={pageTreeOnClick}>
        Navigate pages
      </MenuButton>
      <EditButton
        isEditing={editButtonIsEditing}
        onToggleEditing={editButtonToggle}
      />

      <MenuButton
        variant="outline"
        items={{
          save: {
            icon: FaDownload,
            label: saveLabel,
            onClick: saveOnClick
          },

          discard: {
            icon: FaTrash,
            label: discardLabel,
            divider: true,
            onClick: discardOnClick
          },
          publish: {
            icon: FaGlobe,
            label: publishLabel,
            onClick: publishOnClick
          }
        }}>
        Save
      </MenuButton>
    </ButtonGroup>
  )
}
