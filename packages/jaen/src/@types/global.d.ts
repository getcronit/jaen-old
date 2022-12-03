import type {NavigateFn} from '@reach/router'

export {}

declare global {
  interface Window {
    ___navigate: NavigateFn
  }
}
