import {PageProps} from 'gatsby'

import {New} from '../../../src/components/cms/Pages/New'
import {JaenPageLayout} from '../../../src/components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../src/theme/with-theme'

const PagesPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout layout="form">
      <New />
    </JaenPageLayout>
  )
}

export default withTheme(PagesPage)
