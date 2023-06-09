import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHeading
} from '@codexteam/icons'
import {API, BaseTool, PasteEvent} from '@editorjs/editorjs'
import React from 'react'

type HeaderData = {
  text: string
  level: number
}

type HeaderConfig = {
  placeholder: string
  levels: number[]
  defaultLevel: number
  Wrapper: React.ComponentType<any>
}

type Level = {
  number: number
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  svg: string
}

/**
 * Header block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
export default class Header implements BaseTool {
  api: API
  readOnly: boolean
  _CSS: {block: any; wrapper: string}
  _settings: HeaderConfig
  _data: HeaderData
  _element: HTMLElement

  constructor({
    data,
    config,
    api,
    readOnly
  }: {
    data: HeaderData
    config: HeaderConfig
    api: API
    readOnly: boolean
  }) {
    this.api = api
    this.readOnly = readOnly

    console.log(data, config, api, readOnly)

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-header'
    }

    /**
     * Tool's settings passed from Editor
     *
     * @type {HeaderConfig}
     * @private
     */
    this._settings = config

    /**
     * Block's data
     *
     * @type {HeaderData}
     * @private
     */
    this._data = this.normalizeData(data)

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag()
  }

  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(data: HeaderData): HeaderData {
    const newData = {} as HeaderData

    if (typeof data !== 'object') {
      data = {} as HeaderData
    }

    newData.text = data.text || ''
    newData.level = parseInt(data.level as any) || this.defaultLevel.number

    return newData
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLElement}
   * @public
   */
  render(): HTMLElement {
    return this._element
  }

  /**
   * Returns header block tunes config
   *
   * @returns {Array}
   */
  renderSettings(): Array<any> {
    return this.levels.map(level => ({
      icon: level.svg,
      label: this.api.i18n.t(`Heading ${level.number}`),
      onActivate: () => this.setLevel(level.number),
      closeOnActivate: true,
      isActive: this.currentLevel.number === level.number
    }))
  }

  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel(level: number) {
    this.data = {
      level: level,
      text: this.data.text
    }
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge(data: HeaderData) {
    const newData = {
      text: this.data.text + data.text,
      level: this.data.level
    }

    this.data = newData
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData: HeaderData): boolean {
    return blockData.text.trim() !== ''
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(toolsContent: HTMLHeadingElement): HeaderData {
    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number
    }
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text' // fill 'text' property from other block's export string
    }
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {}
    }
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported(): boolean {
    return true
  }

  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data(): HeaderData {
    this._data.text = this._element.innerHTML
    this._data.level = this.currentLevel.number

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(data: HeaderData) {
    this._data = this.normalizeData(data)

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLElement}
       */
      const newHeader: HTMLElement = this.getTag()

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.firstElementChild?.innerHTML || ''

      /**
       * Replace blocks
       */
      this._element.replaceChild(newHeader, this._element)

      /**
       * Save new block to private variable
       *
       * @type {HTMLElement}
       * @private
       */
      this._element = newHeader
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || ''
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag(): HTMLElement {
    const editorjs = document.getElementById('editorjs')

    if (!editorjs) throw new Error('editorjs not found')
  }

  /**
   * Get current level
   *
   * @returns {number}
   */
  get currentLevel(): Level {
    let level = this.levels.find(
      levelItem => levelItem.number === this._data.level
    )

    if (!level) {
      level = this.defaultLevel
    }

    return level
  }

  /**
   * Return default level
   *
   * @returns {Level}
   */
  get defaultLevel(): Level {
    /**
     * User can specify own default level value
     */
    if (this._settings.defaultLevel) {
      const userSpecified = this.levels.find(levelItem => {
        return levelItem.number === this._settings.defaultLevel
      })

      if (userSpecified) {
        return userSpecified
      } else {
        console.warn(
          "(ง'̀-'́)ง Heading Tool: the default level specified was not found in available levels"
        )
      }
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {level}
     */

    if (this.levels[1]) {
      return this.levels[1]
    }

    throw new Error('No available levels')
  }

  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */

  /**
   * Available header levels
   *
   * @returns {Level[]}
   */
  get levels(): Level[] {
    const availableLevels: Level[] = [
      {
        number: 1,
        tag: 'h1',
        svg: IconH1
      },
      {
        number: 2,
        tag: 'h2',
        svg: IconH2
      },
      {
        number: 3,
        tag: 'h3',
        svg: IconH3
      },
      {
        number: 4,
        tag: 'h4',
        svg: IconH4
      },
      {
        number: 5,
        tag: 'h5',
        svg: IconH5
      },
      {
        number: 6,
        tag: 'h6',
        svg: IconH6
      }
    ]

    return this._settings.levels
      ? availableLevels.filter(l => this._settings.levels.includes(l.number))
      : availableLevels
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event: PasteEvent) {
    const content = (event.detail as any).data

    /**
     * Define default level value
     *
     * @type {number}
     */
    let level: number = this.defaultLevel.number

    switch (content.tagName) {
      case 'H1':
        level = 1
        break
      case 'H2':
        level = 2
        break
      case 'H3':
        level = 3
        break
      case 'H4':
        level = 4
        break
      case 'H5':
        level = 5
        break
      case 'H6':
        level = 6
        break
    }

    if (this._settings.levels) {
      // Fallback to nearest level when specified not available
      level = this._settings.levels.reduce((prevLevel, currLevel) => {
        return Math.abs(currLevel - level) < Math.abs(prevLevel - level)
          ? currLevel
          : prevLevel
      })
    }

    this.data = {
      level,
      text: content.innerHTML
    }
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig(): {
    handler?: (arg0: HTMLElement) => {text: string}
    tags: string[]
  } {
    return {
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox(): {icon: string; title: string} {
    return {
      icon: IconHeading,
      title: 'Heading'
    }
  }
}
