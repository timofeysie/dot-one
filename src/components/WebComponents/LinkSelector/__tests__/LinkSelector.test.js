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
});
