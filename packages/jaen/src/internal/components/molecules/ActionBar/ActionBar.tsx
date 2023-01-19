import {ButtonGroup, HStack} from '@chakra-ui/react'

import {PageManagerProvider} from '../../../context/PagesManagerContext.js'
import {
  DiscardActionButton,
  EditActionButton,
  PublishActionButton,
  SaveDraftActionButton
} from '../../atoms/index.js'
import {PageNavigator} from '../../organisms/PageNavigator/index.js'

export interface ActionBarProps {}

export const ActionBar: React.FC<ActionBarProps> = () => {
  return (
    <HStack color="gray.500" w="full" justifyItems="start">
      <PageManagerProvider>
        <PageNavigator />
      </PageManagerProvider>

      <ButtonGroup isAttached variant="solid" size="sm">
        <EditActionButton />
        <DiscardActionButton />
        <SaveDraftActionButton />
        <PublishActionButton />
      </ButtonGroup>
    </HStack>
  )
}
