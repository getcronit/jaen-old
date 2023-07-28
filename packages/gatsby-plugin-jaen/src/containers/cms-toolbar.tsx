import {ToolbarButtons} from '../components/cms/ToolbarButtons'
import {CMSManagement, useCMSManagement} from '../connectors/cms-management'

const CMSToolbar: React.FC = () => {
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
}

export const CMSToolbarContainer = () => {
  return (
    <CMSManagement>
      <CMSToolbar />
    </CMSManagement>
  )
}
