import {PageProps} from 'gatsby'

import {New} from '../../../components/cms/Pages/New'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'

const PagesPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="form">
      <New />
    </JaenPageLayout>
  )
}

export default withTheme(PagesPage)
