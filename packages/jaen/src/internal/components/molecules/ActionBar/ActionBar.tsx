import {ButtonGroup, HStack} from '@chakra-ui/react'
import {
  DiscardActionButton,
  EditActionButton,
  PublishActionButton,
  SaveDraftActionButton
} from '../../atoms/index.js'

export interface ActionBarProps {}

export const ActionBar: React.FC<ActionBarProps> = () => {
  return (
    <HStack h="full" color="gray.500">
      <ButtonGroup isAttached variant="solid" size="sm">
        <EditActionButton />
        <DiscardActionButton />
        <SaveDraftActionButton />
        <PublishActionButton />
      </ButtonGroup>
    </HStack>
  )
}
