import {PageProps} from 'gatsby'

import {Pages} from '../../../components/cms/Pages/Pages'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'

const PagesPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <Pages />
    </JaenPageLayout>
  )
}

export default withTheme(PagesPage)
