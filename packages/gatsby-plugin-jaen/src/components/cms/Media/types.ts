export interface MediaNode {
  id: string
  createdAt: string
  modifiedAt: string
  preview?: {
    url: string
  }
  url: string
  description?: string
  width: number
  height: number
  revisions?: Array<Omit<MediaNode, 'revisions'>>
  jaenPageId?: string
}

export type MediaPreviewState = 'PREVIEW' | 'EDIT' | false
