import {PageProps} from 'gatsby'
import {withTheme} from '../../theme/with-theme'

import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import {MediaContainer} from '../../containers/media'

const MediaPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="full">
      <MediaContainer mediaNodes={[]} />
    </JaenPageLayout>
  )
}

export default withTheme(MediaPage)
