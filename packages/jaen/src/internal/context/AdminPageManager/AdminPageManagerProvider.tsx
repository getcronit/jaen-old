import {
  AdminPageManagerContext,
  AdminPageManagerContextType
} from './AdminPageManager.js'

export interface AdminPageManagerProviderProps
  extends AdminPageManagerContextType {
  children: React.ReactNode
}

export const AdminPageManagerProvider: React.FC<AdminPageManagerProviderProps> =
  ({children, ...contextValue}) => {
    return (
      <AdminPageManagerContext.Provider value={contextValue}>
        {children}
      </AdminPageManagerContext.Provider>
    )
  }
