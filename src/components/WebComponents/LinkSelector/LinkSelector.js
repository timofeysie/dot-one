class LinkSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      selectedLink: null,
      links: [
        {
          type: "APNewsLink",
          baseUrl: "https://apnews.com/hub/",
          title: "AP News",
        },
        {
          type: "WikipediaLink",
          baseUrl: "https://en.wikipedia.org",
          title: "Wikipedia",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.render();
  }

  connectedCallback() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    const select = this.shadowRoot.querySelector('select');
    if (select) {
      select.addEventListener('change', this.handleChange);
    }
  }

  handleChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedLink: selectedValue });
    this.dispatchEvent(new CustomEvent('linkSelected', {
      detail: selectedValue,
      bubbles: true,
      composed: true
    }));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
    this.attachEventListeners();
  }

  render() {
    const template = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          background-color: white;
        }
      </style>
      <select>
        <option value="">Select a link source...</option>
        ${this.state.links.map(link => `
          <option value="${link.type}">${link.title}</option>
        `).join('')}
      </select>
    `;
    
    this.shadowRoot.innerHTML = template;
  }
}

customElements.define("link-selector", LinkSelector);
