import React from "react";

const LuminaLogo = ({ size = 40 }) => {
  const px = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      style={{ width: px, height: px }}
      className="bg-gradient-to-br from-brand-violet via-brand-navy to-brand-cyan rounded-2xl flex items-center justify-center shadow-xl glow-blue"
    >
      <svg
        width="70%"
        height="70%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lumina-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <path
          d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z"
          fill="url(#lumina-grad)"
          opacity="0.95"
        />
      </svg>
    </div>
  );
};

export default LuminaLogo;
