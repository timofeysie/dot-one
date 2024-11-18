class LinkSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      selectedLink: 'APNewsLink',
      searchTerm: '',
      links: {
        APNewsLink: {
          name: 'AP News',
          baseUrl: 'https://apnews.com/hub/',
          formatTerm: (term) => term.split(' ').join('-')
        },
        WikipediaLink: {
          name: 'Wikipedia',
          baseUrl: 'https://en.wikipedia.org/wiki/',
          formatTerm: (term) => term.split(' ').join('_')
        },
        GoogleNewsLink: {
          name: 'Google News',
          baseUrl: 'https://news.google.com/search?q=',
          formatTerm: (term) => encodeURIComponent(term)
        }
      }
    };

    this.handleUseLink = this.handleUseLink.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  static get observedAttributes() {
    return ['search-term'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'search-term' && oldValue !== newValue) {
      this.state.searchTerm = newValue || '';
      this.render();
    }
  }

  constructUrl() {
    const link = this.state.links[this.state.selectedLink];
    if (!this.state.searchTerm) return link.baseUrl;
    return `${link.baseUrl}${link.formatTerm(this.state.searchTerm)}`;
  }

  handleUseLink() {
    const link = this.state.links[this.state.selectedLink];
    const detail = { 
      url: this.constructUrl(),
      title: this.state.searchTerm,
      linkType: link.name
    };
    this.dispatchEvent(new CustomEvent('useLink', { detail }));
  }

  handleSelectChange(e) {
    this.state.selectedLink = e.target.value;
    this.render();
    this.dispatchEvent(new CustomEvent('linkSelected', {
      detail: { 
        selectedLink: this.state.selectedLink,
        constructedUrl: this.constructUrl()
      }
    }));
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const select = this.shadowRoot.querySelector('[data-testid="link-select"]');
    const useButton = this.shadowRoot.querySelector('[data-testid="use-link-button"]');
    
    select.addEventListener('change', this.handleSelectChange);
    useButton.addEventListener('click', this.handleUseLink);
  }

  render() {
    const constructedUrl = this.constructUrl();
    
    this.shadowRoot.innerHTML = `
      <div>
        <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between;">
          <select data-testid="link-select">
            ${Object.entries(this.state.links).map(([key, link]) => `
              <option value="${key}" ${key === this.state.selectedLink ? 'selected' : ''}>
                ${link.name}
              </option>
            `).join('')}
          </select>
          <button 
            data-testid="use-link-button"
            type="button"
          >Use Link</button>
        </div>
        <div>
          <a 
            data-testid="url-display"
            href="${constructedUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >${constructedUrl}</a>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }
}

if (!customElements.get('link-selector')) {
  customElements.define('link-selector', LinkSelector);
}

export default LinkSelector;
