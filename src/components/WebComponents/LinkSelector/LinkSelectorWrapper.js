import React, { useEffect, useRef } from 'react';
import './LinkSelector';

// eslint-disable-next-line react/prop-types, no-unused-vars
const LinkSelectorWrapper = ({ searchTerm = '', onSelect, onUseLink }) => {
  const selectorRef = useRef(null);

  useEffect(() => {

    if (selectorRef.current) {
      const handleUseLink = (e) => {
        if (onUseLink) {
          onUseLink(e.detail);
        } else {
          console.warn('LinkSelectorWrapper: onUseLink prop is not defined');
        }
      };

      selectorRef.current.addEventListener('useLink', handleUseLink);

      return () => {
        if (selectorRef.current) {
          selectorRef.current.removeEventListener('useLink', handleUseLink);
        }
      };
    }
  }, [onUseLink]);

  useEffect(() => {
    if (selectorRef.current) {
      selectorRef.current.setAttribute('search-term', searchTerm || '');
    }
  }, [searchTerm]);

  return <link-selector ref={selectorRef} search-term={searchTerm} />;
};

export default LinkSelectorWrapper;
