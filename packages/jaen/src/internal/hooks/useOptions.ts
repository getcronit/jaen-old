export interface IOptions {
  isPublishing: boolean
  isEditing: boolean
}

export const useOptions = (): IOptions => {
  return {
    isPublishing: true,
    isEditing: false
  }
}
