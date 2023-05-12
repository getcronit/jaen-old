export interface BaseEditorProps {
  children: string
  components?: Record<string, React.ComponentType>
  onUpdateValue?: (value: string) => void
  mode?: 'preview' | 'build' | 'editAndPreview' | 'editAndBuild'
}
