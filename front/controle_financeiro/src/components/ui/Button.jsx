import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
