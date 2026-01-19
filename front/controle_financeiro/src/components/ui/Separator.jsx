import React from 'react';

export function Separator({ className = '' }) {
  return (
    <div className={`h-px bg-gray-300 my-2 ${className}`}></div>
  );
}
