import React from "react";

const Footer = () => (
  <footer className="mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-gradient-to-r from-brand-cyan/40 via-brand-violet/40 to-brand-cyan/40 mb-6" />
      <div className="glass-panel border border-white/10 rounded-2xl py-6 text-center text-slate-400">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-gradient font-semibold">EventsHub</span>. All
        rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
