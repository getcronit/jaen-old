import {BlockTool, BlockToolConstructorOptions} from '@editorjs/editorjs'
import {TunesMenuConfig} from '@editorjs/editorjs/types/tools/tool-settings.js'

type Constructor<D extends object, C extends object> = new (
  config: BlockToolConstructorOptions
) => BlockTool & BlockToolConstructorOptions<D, C>

export function enhanceBlockTool<D extends Object, C extends Object>(
  BaseClass: Constructor<D, C>,
  options: {
    render: (
      data: BlockToolConstructorOptions<D, C>['data'],
      args: {
        readOnly?: boolean
        updateBlock: (
          newData: BlockToolConstructorOptions<D, C>['data']
        ) => void
      }
    ) => JSX.Element
    renderSettings?: (
      block: BlockToolConstructorOptions<D, C>
    ) => HTMLElement | TunesMenuConfig
    save?: (
      block: HTMLElement
    ) => BlockToolConstructorOptions<D, C>['data'] | undefined
  }
) {
  return class EnhancedBlockTool extends BaseClass {
    static jsxRender(
      data: BlockToolConstructorOptions<D, C>['data'],
      args: {
        readOnly?: boolean
        updateBlock: (
          newData: BlockToolConstructorOptions<D, C>['data']
        ) => void
      }
    ): JSX.Element {
      return options.render(data, args)
    }

    constructor(config: BlockToolConstructorOptions<D, C>) {
      console.log(config)

      super(config)

      this.block = config?.block
    }

    render(): HTMLElement {
      const container = document.createElement('div')

      const element = super.render()

      element.style.display = 'none'

      container.appendChild(element)
      container.id = this.block?.id || ''

      return container
    }

    renderSettings?(): HTMLElement | TunesMenuConfig {
      return (
        options.renderSettings?.(this) ||
        super.renderSettings?.() ||
        document.createElement('div')
      )
    }

    save(block: HTMLElement) {
      if (options.save) {
        return options.save(block)
      }

      return super.save(block)
    }
  }
}

export type EnhancedBlockTool = ReturnType<typeof enhanceBlockTool>
