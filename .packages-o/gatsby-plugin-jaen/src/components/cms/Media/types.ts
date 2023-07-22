export interface MediaNode {
  id: string
  preview?: {
    url: string
  }
  url: string
  description?: string
  width: number
  height: number
  revisions: MediaNode[]
}

export type MediaPreviewState = 'PREVIEW' | 'EDIT' | false
