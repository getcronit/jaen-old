import {PageProps} from 'gatsby'
import {withTheme} from '../../theme/with-theme'

import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {MediaConnector} from '../../connectors/media'

const MediaPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="full">
      <MediaConnector mediaNodes={[]} />
    </JaenPageLayout>
  )
}

export default withTheme(MediaPage)
