import React from "react";
import { render, waitFor } from "@testing-library/react";
import LinkSelectorWrapper from "../LinkSelectorWrapper";

// Create a helper function to safely define the custom element
const defineMockLinkSelector = async () => {
  // Only define if it doesn't already exist
  if (!customElements.get("link-selector")) {
    class MockLinkSelector extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.shadowRoot.innerHTML = `
          <select>
            <option value="">Select a link source...</option>
            <option value="APNewsLink">AP News</option>
            <option value="WikipediaLink">Wikipedia</option>
          </select>
        `;
      }
    }

    customElements.define("link-selector", MockLinkSelector);
  }

  return customElements.whenDefined("link-selector");
};

describe("LinkSelectorWrapper", () => {
  // Suppress console.warn for these tests
  const originalWarn = console.warn;
  beforeAll(async () => {
    console.warn = jest.fn();
    await defineMockLinkSelector();
  });

  // Restore console.warn after tests
  afterAll(() => {
    console.warn = originalWarn;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders without crashing", async () => {
    const { container } = render(<LinkSelectorWrapper />);
    await waitFor(() => {
      const linkSelector = container.querySelector("link-selector");
      expect(linkSelector).toBeInTheDocument();
    });
  });

  it("calls onSelect when a link is selected", async () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <LinkSelectorWrapper onSelect={mockOnSelect} />
    );

    await waitFor(() => {
      const linkSelector = container.querySelector("link-selector");
      expect(linkSelector).toBeInTheDocument();

      linkSelector.dispatchEvent(
        new CustomEvent("linkSelected", {
          detail: "APNewsLink",
          bubbles: true,
          composed: true,
        })
      );

      expect(mockOnSelect).toHaveBeenCalledWith("APNewsLink");
    });
  });

  test("passes search term to link-selector component", () => {
    // Mock the custom element registration
    if (!customElements.get('link-selector')) {
      customElements.define('link-selector', class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
      });
    }

    render(<LinkSelectorWrapper searchTerm="Test Title" onSelect={() => {}} />);
    
    const linkSelector = document.querySelector('link-selector');
    expect(linkSelector).toHaveAttribute('search-term', 'Test Title');
  });
});
