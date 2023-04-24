import {sq} from '@snek-functions/origin'
import {useCallback, useState} from 'react'

import {snekResourceId} from '../../snekResourceId.js'
import {prepareMigration} from '../helper/clientMigration.js'

import {upload} from '../../utils/osg.js'

export const usePublish = () => {
  const [isPublishing, setIsPublishing] = useState(false)

  const publish = useCallback(async () => {
    const {blob, filename} = await prepareMigration()

    const migrationURL = await upload(blob, filename)

    const [_, errors] = await sq.mutate(Mutation =>
      Mutation.jaenPublish({
        resourceId: snekResourceId,
        migrationURL
      })
    )

    if (errors) {
      throw new Error(
        `Error while publishing: ${errors.map(e => e.message).join(', ')}`
      )
    }

    setIsPublishing(true)
  }, [])

  return {isPublishing, publish}
}
