import "../LinkSelector.js";

describe("LinkSelector", () => {
  let linkSelector;

  beforeEach(async () => {
    if (customElements.get("link-selector")) {
      await customElements.whenDefined("link-selector");
    }

    linkSelector = document.createElement("link-selector");
    document.body.appendChild(linkSelector);
    await customElements.whenDefined("link-selector");
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  afterEach(() => {
    if (linkSelector && linkSelector.parentNode) {
      document.body.removeChild(linkSelector);
    }
  });

  it("should render select element with options", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const select = linkSelector.shadowRoot.querySelector("select");
    expect(select).toBeTruthy();

    const options = select.querySelectorAll("option");
    expect(options.length).toBe(3); // Including the default option
  });

  it("should dispatch linkSelected event when option is selected", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const select = linkSelector.shadowRoot.querySelector("select");
    const mockHandler = jest.fn();

    linkSelector.addEventListener("linkSelected", mockHandler);

    // Simulate selection
    const event = new Event("change");
    Object.defineProperty(event, "target", { value: { value: "APNewsLink" } });
    select.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalled();
  });

  it("should update state when option is selected", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const select = linkSelector.shadowRoot.querySelector("select");

    select.value = "WikipediaLink";
    select.dispatchEvent(new Event("change"));

    expect(linkSelector.state.selectedLink).toBe("WikipediaLink");
  });

  test('displays first link option as preselected with constructed URL', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '<link-selector></link-selector>';
    const linkSelector = container.querySelector('link-selector');
    const shadow = linkSelector.shadowRoot;

    const select = shadow.querySelector('[data-testid="link-select"]');
    expect(select.value).toBe('APNewsLink');

    const urlDisplay = shadow.querySelector('[data-testid="url-display"]');
    expect(urlDisplay).toBeInTheDocument();
    expect(urlDisplay.textContent).toBe('https://apnews.com/hub/');
  });

  test('updates URL when searchTerm attribute changes', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '<link-selector></link-selector>';
    const linkSelector = container.querySelector('link-selector');
    
    // Set the search term
    linkSelector.setAttribute('search-term', 'Breaking News Story');
    
    const shadow = linkSelector.shadowRoot;
    const urlDisplay = shadow.querySelector('[data-testid="url-display"]');
    
    // Should format the URL with dashes
    expect(urlDisplay.textContent).toBe('https://apnews.com/hub/Breaking-News-Story');
    expect(urlDisplay.href).toBe('https://apnews.com/hub/Breaking-News-Story');
  });

  test('updates URL format based on selected link type', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '<link-selector search-term="Breaking News"></link-selector>';
    const linkSelector = container.querySelector('link-selector');
    const shadow = linkSelector.shadowRoot;

    // Change to Wikipedia
    const select = shadow.querySelector('[data-testid="link-select"]');
    select.value = 'WikipediaLink';
    select.dispatchEvent(new Event('change'));

    const urlDisplay = shadow.querySelector('[data-testid="url-display"]');
    expect(urlDisplay.textContent).toBe('https://en.wikipedia.org/wiki/Breaking_News');
  });

  test('emits useLink event when button is clicked', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '<link-selector search-term="Test Title"></link-selector>';
    const linkSelector = container.querySelector('link-selector');
    
    // Create a spy for the event
    const useLinkSpy = jest.fn();
    linkSelector.addEventListener('useLink', (e) => useLinkSpy(e.detail));
    
    const shadow = linkSelector.shadowRoot;
    const useButton = shadow.querySelector('[data-testid="use-link-button"]');
    
    useButton.click();
    
    expect(useLinkSpy).toHaveBeenCalledWith({
      url: 'https://apnews.com/hub/Test-Title',
      title: 'Test Title',
      linkType: 'AP News'
    });
  });

  // Clean up after test
  afterEach(() => {
    document.body.innerHTML = '';
  });
});
