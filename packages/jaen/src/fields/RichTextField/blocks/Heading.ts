import {
  BlockTool,
  BlockToolConstructorOptions,
  BlockToolData
} from '@editorjs/editorjs'

interface HeadingBlockData {
  text: string
  level: number
}

class Heading implements BlockTool {
  private readonly level: number
  private readonly data: HeadingBlockData
  //   private readonly api: API

  //   static get toolbox() {
  //     return {
  //       title: 'Heading',
  //       icon: '<svg viewBox="0 0 24 24"><path d="M6 4h12v3H6zm0 5h12v3H6zm0 5h12v3H6zm0 5h12v3H6z"/></svg>'
  //     }
  //   }

  constructor({
    data
  }: BlockToolConstructorOptions<BlockToolData, HeadingBlockData>) {
    this.level = data.level || 1
    this.data = {
      text: data.text || '',
      level: this.level
    }
    // this.api = api
  }

  render() {
    const heading = document.createElement(`h${this.level}`)
    heading.contentEditable = 'true'
    heading.classList.add('custom-heading-plugin')
    heading.innerHTML = this.data.text
    return heading
  }

  save() {
    const text = this.data.text

    return {
      text,
      level: this.level
    }
  }
}

export default Heading
