import {SerializedError} from '@reduxjs/toolkit'

import {IJaenPage} from '../../types.js'

export type IError = {
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
    registeredPageFields: {
      [uuid: string]: number
    }
    nodes: {
      [uuid: string]: Partial<IJaenPage>
    }
  }
  routing: {
    dynamicPaths: {
      [path: string]: {
        pageId: string
        templateName: string
      }
    }
  }
}

export interface IJaenState {
  auth: IAuthState
  page: IPageState
}
