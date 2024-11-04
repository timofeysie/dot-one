import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Import the web component
import "./LinkSelector";

const LinkSelectorWrapper = ({ onSelect }) => {
  const webComponentRef = useRef(null);

  useEffect(() => {
    const webComponent = webComponentRef.current;
    if (webComponent) {
      const handleLinkSelected = (event) => {
        if (onSelect) onSelect(event.detail);
      };

      webComponent.addEventListener("linkSelected", handleLinkSelected);

      return () => {
        webComponent.removeEventListener("linkSelected", handleLinkSelected);
      };
    }
  }, [onSelect]);

  return (
    <div>
      <link-selector ref={webComponentRef}></link-selector>
    </div>
  );
};

LinkSelectorWrapper.propTypes = {
  onSelect: PropTypes.func,
};

LinkSelectorWrapper.defaultProps = {
  onSelect: () => {},
};

export default LinkSelectorWrapper;
