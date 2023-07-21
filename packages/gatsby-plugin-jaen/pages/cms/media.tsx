import {PageProps} from 'gatsby'

import {JaenPageLayout} from '../../src/components/JaenPageLayout/JaenPageLayout'
import {MediaConnector} from '../../src/connectors/media'
import {withTheme} from '../../src/theme/with-theme'

const MediaPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="full">
      <MediaConnector />
    </JaenPageLayout>
  )
}

export default withTheme(MediaPage)
