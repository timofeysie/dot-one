class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = { count: 0 };
    this.render = this.render.bind(this);
    this.incrementState = this.incrementState.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  incrementState() {
    this.setState({ count: this.state.count + 1 });
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Styles here */
      </style>
      <div>
        Count: ${this.state.count}
      </div>
    `;
  }
}

customElements.define("my-component", MyComponent);
