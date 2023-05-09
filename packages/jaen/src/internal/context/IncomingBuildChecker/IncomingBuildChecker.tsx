import {useDisclosure} from '@chakra-ui/react'
import {useEffect} from 'react'
import {IncomingBuildAlert} from '../../components/organisms/alerts/index.js'
import {withRedux} from '../../redux/index.js'

import {useIncomingBuild} from './useIncomingBuild.js'

export const IncomingBuildChecker = withRedux(() => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const {isIncomingBuild, updateToLatest} = useIncomingBuild()

  useEffect(() => {
    if (isIncomingBuild) {
      onOpen()
    }
  }, [isIncomingBuild])

  const handleUpdateConfirm = async () => {
    updateToLatest()

    return true
  }

  const {totalChanges} = useChanges()

  return (
    <IncomingBuildAlert
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleUpdateConfirm}
      totalChanges={totalChanges}
    />
  )
})

function useChanges(): {totalChanges: any} {
  return {
    totalChanges: 0
  }
}
