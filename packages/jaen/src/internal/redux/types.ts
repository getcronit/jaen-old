import {SerializedError} from '@reduxjs/toolkit'

import {IJaenPage, IJaenPopup, ISite, IWidget} from '../../types.js'

export interface IError {
  code: string
  message: string
  details?: any
}

export interface IAuthState {
  isLoading: boolean
  error?: SerializedError
  isAuthenticated: boolean
  user: {
    email: string
  } | null
}

export interface IPageState {
  pages: {
    lastAddedNodeId?: string
    registeredPageFields: Record<string, number>
    nodes: Record<string, Partial<IJaenPage>>
  }
  routing: {
    dynamicPaths: Record<
      string,
      {
        pageId: string
        templateName: string
      }
    >
  }
}

export interface IStatusState {
  isPublishing: boolean
  isEditing: boolean
}

export interface IPopupState {
  nodes: Record<string, IJaenPopup>
  advanced: Record<
    string,
    {
      pageViews: number
    }
  >
}

export interface IJaenSiteState {
  siteMetadata: ISite['siteMetadata']
}

export interface IJaenState {
  auth: IAuthState
  site: IJaenSiteState
  page: IPageState
  status: IStatusState
  popup: IPopupState
  widget: IWidget
}
