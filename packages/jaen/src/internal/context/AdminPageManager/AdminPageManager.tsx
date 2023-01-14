import React from 'react'
import {IJaenPage, IJaenTemplate} from '../../../types.js'

export type PageTreeItems = Array<{
  path: string
  title: string
  isLocked?: boolean
}>

export interface PageCreateValues {
  slug: string
  title: string
  template: Omit<IJaenTemplate, 'children'>
}

export interface PageContentValues {
  title: string
  slug: string
  image?: string
  description?: string
  excludedFromIndex?: boolean
}

export interface AdminPageManagerContextType {
  getPageIdFromPath: (path: string) => string | null
  getPathFromPageId: (pageId: string) => string | null
  latestAddedPageId: string | undefined
  onCreate: (
    parentId: string | null,
    values: PageCreateValues
  ) => {
    payload: Partial<IJaenPage> & {
      id?: string | undefined
      fromId?: string | undefined
    }
    type: string
  }
  onDelete: (id: string) => void
  onMove: (
    id: string,
    oldParentId: string | null,
    newParentId: string | null
  ) => void
  onUpdate: (id: string, values: PageContentValues) => void
  onGet: (id: string) => IJaenPage | null
  onNavigate: (path: string) => void
  pageTree: IJaenPage[]
  pagePaths: PageTreeItems
  templates: IJaenTemplate[]
  isTemplatesLoading: boolean
  rootPageId: string
  onToggleCreator: (parentId: string | null) => void
}

export const AdminPageManagerContext =
  React.createContext<AdminPageManagerContextType | undefined>(undefined)

export const usePageManager = () => {
  const context = React.useContext(AdminPageManagerContext)
  if (context == null) {
    throw new Error(
      'usePageManager must be used within a AdminPageManagerContext'
    )
  }
  return context
}
