import {Flex} from '@chakra-ui/react'
import React from 'react'

import {PageContentForm} from '../shared/PageContentForm/PageContentForm'

export interface NewProps {}

export const New: React.FC<NewProps> = () => {
  return (
    <Flex id="coco">
      <PageContentForm
        onSubmit={data => {
          console.log(data)
        }}
      />
    </Flex>
  )
}
