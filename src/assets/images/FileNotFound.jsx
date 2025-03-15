import React from "react";

const FileNotFound = ({color = 'currentColor', size = 24}) => {
  return (
    <svg width={size} height={size} strokeWidth={1.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8L12 12" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16.01L12.01 15.9989" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 3H4V6" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 11V13" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 11V13" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3H20V6" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21H4V18" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 21H20V18" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default FileNotFound;
