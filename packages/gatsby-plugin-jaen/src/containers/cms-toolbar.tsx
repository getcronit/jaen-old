import {ToolbarButtons} from '../components/cms/ToolbarButtons'
import {useCMSManagement, withCMSManagement} from '../connectors/cms-management'

const CMSToolbarContainer: React.FC = withCMSManagement(() => {
  const manager = useCMSManagement()

  return (
    <ToolbarButtons
      editButtonIsEditing={manager.isEditing}
      editButtonToggle={() => {
        manager.setIsEditing(!manager.isEditing)
      }}
      saveLabel="Local save"
      saveOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
      discardLabel="Discard changes"
      discardOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
      publishLabel="Publish"
      publishOnClick={function (): void {
        throw new Error('Function not implemented.')
      }}
    />
  )
})

export default CMSToolbarContainer
