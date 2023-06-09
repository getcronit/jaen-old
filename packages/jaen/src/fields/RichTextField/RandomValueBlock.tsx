const RandomValueBlock = class {
  static get toolbox() {
    return {
      title: 'Random Value',
      icon: '<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M9 2h6v2h2v18h-2v2h-2v-2h-2v-2h-2v-2h-2v-2H9v-2H7V4H5V2h4zm0 2v16h6V4H9zm-2 0H7v16h2V4zM5 4H3v16h2V4zm-2 18h2v2H3v-2z" fill="currentColor" fill-rule="nonzero"></path></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  constructor({data, api}) {
    this.data = data
    this.api = api
    this.id = uuidv4() // Assign a random value as the ID

    // Initialize the Header Tool to render the block content
    this.headerTool = new HeaderTool({
      data: {
        text: this.id,
        level: HEADER_LEVELS.H2
      },
      config: {
        placeholder: 'Enter header text',
        levels: [HEADER_LEVELS.H2]
      }
    })
  }

  async render() {
    this.container = document.createElement('div')
    this.container.classList.add('random-value-block')

    const headerElement = await this.headerTool.render()

    ReactDOM.render(
      <div>
        <div>{headerElement}</div>
      </div>,
      this.container
    )

    return this.container
  }

  save() {
    return {
      id: this.id,
      type: 'randomValueBlock',
      data: this.headerTool.save()
    }
  }

  static get sanitize() {
    return {
      text: {
        br: true
      },
      level: {}
    } as SanitizerConfig
  }
}

export default RandomValueBlock
