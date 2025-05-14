import React from 'react';

function CustomLink({ to, children, ...props }) {
  const handleNavigation = (e) => {
    e.preventDefault(); // Prevent default link behavior
    window.history.pushState({}, '', to); // Update the URL without reloading
    window.dispatchEvent(new PopStateEvent('popstate')); // Notify the router of the change
  };

  return (
    <a href={to} onClick={handleNavigation} {...props}>
      {children}
    </a>
  );
}

export default CustomLink;
