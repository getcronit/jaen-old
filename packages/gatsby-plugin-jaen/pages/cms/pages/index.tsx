import {PageProps} from 'gatsby'

import {Pages} from '../../../src/components/cms/Pages/Pages'
import {JaenPageLayout} from '../../../src/components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../src/theme/with-theme'

const PagesPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <Pages />
    </JaenPageLayout>
  )
}

export default withTheme(PagesPage)
