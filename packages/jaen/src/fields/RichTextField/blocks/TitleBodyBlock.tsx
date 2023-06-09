import {
  BlockTool,
  BlockToolConstructorOptions,
  ToolConfig
} from '@editorjs/editorjs'

interface TitleBodyData {
  title: string
  body: string
}

export default class TitleBodyBlock implements BlockTool {
  static get toolbox(): ToolConfig {
    return {
      title: 'Title Body Block',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 5h18v2H3V5zm0 4h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>'
    }
  }

  static get sanitize(): {[key: string]: unknown} {
    return {
      title: {},
      body: {}
    }
  }

  static get data(): TitleBodyData {
    return {
      title: '',
      body: ''
    }
  }

  private data: TitleBodyData
  private wrapper: HTMLElement | null
  private titleInput: HTMLInputElement | null
  private bodyInput: HTMLElement | null

  constructor({data}: BlockToolConstructorOptions<TitleBodyData>) {
    this.data = {...TitleBodyBlock.data, ...data}
    this.wrapper = null
    this.titleInput = null
    this.bodyInput = null
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('title-body-block')

    this.titleInput = document.createElement('input')
    this.titleInput.classList.add('title-body-block__title')
    this.titleInput.placeholder = 'Title'
    this.titleInput.value = this.data.title
    this.titleInput.addEventListener('input', this.handleTitleChange.bind(this))

    this.bodyInput = document.createElement('div')
    this.bodyInput.classList.add('title-body-block__body')
    this.bodyInput.contentEditable = 'true'
    this.bodyInput.innerHTML = this.data.body
    this.bodyInput.addEventListener('input', this.handleBodyChange.bind(this))

    this.wrapper.appendChild(this.titleInput)
    this.wrapper.appendChild(this.bodyInput)

    return this.wrapper
  }

  private handleTitleChange(): void {
    this.data.title = this.titleInput?.value || ''
  }

  private handleBodyChange(): void {
    this.data.body = this.bodyInput?.innerHTML || ''
  }

  save(blockElement: any): TitleBodyData {
    console.log(blockElement)

    return this.data
  }
}
