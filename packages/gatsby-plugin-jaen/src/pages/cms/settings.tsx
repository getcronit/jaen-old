import {PageProps} from 'gatsby'

import {withTheme} from '../../theme/with-theme'

import {FormDataType, Settings} from '../../components/cms/Settings/Settings'
import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'

const SettingsPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <Settings
        data={{}}
        isPublishing={false}
        migrations={[]}
        onUpdate={function (_data: FormDataType): void {
          throw new Error('Function not implemented.')
        }}
      />
    </JaenPageLayout>
  )
}

export default withTheme(SettingsPage)
