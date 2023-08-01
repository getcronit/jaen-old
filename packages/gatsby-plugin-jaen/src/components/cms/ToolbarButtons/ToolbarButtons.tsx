import {ButtonGroup, Icon} from '@chakra-ui/react'
import {
  FaSitemap,
  FaCaretDown,
  FaDownload,
  FaTrash,
  FaGlobe,
  FaUpload
} from 'react-icons/fa'

import {MenuButton} from '../../shared/MenuButton'
import {EditButton} from './components/EditButton'

export interface ToolbarButtonsProps {
  // Props for the EditButton
  editButtonIsEditing: boolean
  editButtonToggle: () => void

  // Props for the MenuButton with multiple items
  saveLabel: string
  saveOnClick: () => void
  importLabel: string
  importOnClick: () => void
  discardLabel: string
  discardOnClick: () => void
  publishLabel: string
  publishOnClick: () => void
}

export const ToolbarButtons: React.FC<ToolbarButtonsProps> = props => {
  const {
    editButtonIsEditing,
    editButtonToggle,
    saveLabel,
    saveOnClick,
    importLabel,
    importOnClick,
    discardLabel,
    discardOnClick,
    publishLabel,
    publishOnClick
  } = props

  return (
    <ButtonGroup variant="outline">
      <EditButton
        isEditing={editButtonIsEditing}
        onToggleEditing={editButtonToggle}
      />

      <MenuButton
        variant="outline"
        items={{
          import: {
            icon: FaUpload,
            label: importLabel,
            onClick: importOnClick
          },
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
