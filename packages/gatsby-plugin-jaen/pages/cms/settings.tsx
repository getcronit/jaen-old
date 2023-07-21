import {OSGBackend, SnekFinderProvider} from '@snek-at/snek-finder'
import {PageProps} from 'gatsby'

import {
  FormDataType,
  Settings
} from '../../src/components/cms/Settings/Settings'
import {JaenPageLayout} from '../../src/components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../src/theme/with-theme'

const SettingsPage: React.FC<PageProps> = () => {
  return (
    <JaenPageLayout>
      <SnekFinderProvider backend={new OSGBackend()}>
        <Settings
          data={{}}
          isPublishing={false}
          migrations={[]}
          onUpdate={function (_data: FormDataType): void {
            throw new Error('Function not implemented.')
          }}
        />
      </SnekFinderProvider>
    </JaenPageLayout>
  )
}

export default withTheme(SettingsPage)
