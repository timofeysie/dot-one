# Web Components

A class based web component.

```js
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = { count: 0 };
    this.render = this.render.bind(this);
    this.incrementState = this.incrementState.bind(this);
  }

  connectedCallback() { this.render(); }

  incrementState() { this.setState({ count: this.state.count + 1 }); }

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
```

Using a React wrapper.

```js
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Make sure your Web Component is imported and defined
import './MyComponent';

const MyComponentWrapper = ({ onIncrement }) => {
  const webComponentRef = useRef(null);

  useEffect(() => {
    const webComponent = webComponentRef.current;
    if (webComponent) {
      // You can add any additional setup here if needed
    }
  }, []);

  const handleIncrement = () => {
    if (webComponentRef.current) {
      webComponentRef.current.incrementState();
      if (onIncrement) onIncrement();
    }
  };

  return (
    <div>
      <my-component ref={webComponentRef}></my-component>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

MyComponentWrapper.propTypes = {
  onIncrement: PropTypes.func
};

MyComponentWrapper.defaultProps = {
  onIncrement: () => {}
};

export default MyComponentWrapper;
```

And used somewhere:

```js
import MyComponentWrapper from "../../components/WebComponents/MyComponentWrapper";

  const handleIncrement = () => {
    console.log('Increment occurred in the Web Component');
    // Add any additional logic you want to execute when increment happens
  };

        <MyComponentWrapper onIncrement={handleIncrement} />
```
