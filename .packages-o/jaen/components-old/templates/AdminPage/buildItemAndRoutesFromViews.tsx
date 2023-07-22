import {Circle} from '@chakra-ui/react'
import {IJaenView} from '../../../../types.js'

export type View = IJaenView

export interface SidebarItem {
  path: string
  Icon: React.ComponentType | null
  label: string
}

export interface UseSidebarItemsProps {
  views: IJaenView[]
}

export interface BuiltViews {
  items: {
    grouped: Record<string, {label: string; items: SidebarItem[]}>
    ungrouped: SidebarItem[]
  }
  routes: Record<string, {Component: React.ComponentType; hasRoutes: boolean}>
  activePath: string
  onNavigate: (path: string) => void
}

export const buildFromViews = (
  views: IJaenView[]
): {
  items: BuiltViews['items']
  routes: BuiltViews['routes']
} => {
  const items: BuiltViews['items'] = {
    grouped: {},
    ungrouped: []
  }

  const routes: BuiltViews['routes'] = {}

  for (const view of views) {
    const item: SidebarItem = {
      path: view.path,
      Icon: view.Icon || Circle,
      label: view.label
    }

    if (view.group) {
      if (items.grouped[view.group] == null) {
        items.grouped[view.group] = {
          label: view.group,
          items: []
        }
      }

      items.grouped[view.group]?.items.push(item)
    } else {
      items.ungrouped.push(item)
    }

    routes[view.path] = {
      Component: view.Component,
      hasRoutes: view.hasRoutes ?? false
    }
  }

  return {
    items,
    routes
  }
}
