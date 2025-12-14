import React from 'react';

const CollegeLogo = ({ src }) => (
  <img
    src={src}
    alt="logo"
    className="w-5 h-5 rounded-sm flex-shrink-0"
    onError={(e) => (e.target.style.display = 'none')} // Hide if image fails
  />
);

export default CollegeLogo;