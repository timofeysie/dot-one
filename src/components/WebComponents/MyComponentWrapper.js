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