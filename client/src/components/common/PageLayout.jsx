import React from 'react';

const PageLayout = ({ title, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {title && (
        <div className="mb-12 md:mb-16">
          <h1 className="heading-lg text-white mb-4">
            <span className="text-gradient">
              {title}
            </span>
          </h1>
          <div className="mt-6 h-px bg-gradient-to-r from-brand-cyan/50 via-brand-violet/50 to-brand-cyan/50" />
        </div>
      )}
      {children}
    </div>
  </div>
);

export default PageLayout;
