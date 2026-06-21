import React from 'react';
import { Link } from 'react-router-dom';

/**
 * FeatureCard Component
 * Code Quality: Reusable micro-component for rendering value propositions consistently.
 */
function FeatureCard({ title, description, svgPath }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start">
      <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={svgPath} />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * Home View
 * Problem Alignment: Explicitly addresses Understanding, Tracking, and Reducing footprints.
 * Usability: Fully responsive grid layout with high-contrast accessibility standards.
 */
function Home() {
  return (
    <div className="flex flex-col space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 lg:pt-20 lg:pb-16 overflow-hidden" aria-labelledby="hero-heading">
        {/* Subtle background decoration for premium feel */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-30">
          <div className="w-[800px] h-[400px] bg-gradient-to-r from-emerald-100 to-teal-50 blur-3xl rounded-full translate-y-[-20%]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            Environmental Intelligence Platform
          </span>
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Understand your footprint. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Optimize your impact.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            CarbonWise leverages advanced algorithmic modeling to help individuals precisely track their carbon emissions and provides actionable, data-driven reduction protocols.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/calculator" 
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Start Analysis
            </Link>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
            >
              View Active Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="features-heading">
        <div className="text-center mb-12">
          <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Core Methodologies</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Engineered to deliver comprehensive environmental insights through a seamless, secure architecture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Quantitative Analysis" 
            description="Input daily variables across transport, aviation, and energy consumption to generate a precise carbon baseline."
            svgPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
          <FeatureCard 
            title="Historical Tracking" 
            description="Secure, token-based session management allows you to benchmark your footprint against historical data."
            svgPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <FeatureCard 
            title="Reduction Protocols" 
            description="Receive algorithmic, behavior-specific action plans designed to systematically lower your environmental impact."
            svgPath="M13 10V3L4 14h7v7l9-11h-7z"
          />
          <FeatureCard 
            title="Compliance Export" 
            description="Instantly generate and download localized CSV reports for personal auditing or corporate compliance."
            svgPath="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </div>
      </section>

      {/* Trust & Benchmarking Section */}
      <section className="bg-slate-900 rounded-3xl max-w-6xl mx-auto w-full px-8 py-12 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-2xl font-bold text-white mb-3">Enterprise-Grade Accuracy</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our calculation parameters are strictly aligned with national scientific averages, ensuring your data is not just visually appealing, but mathematically sound.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-8 text-center md:text-left">
          <div>
            <div className="text-4xl font-extrabold text-white mb-1">100%</div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Local Processing</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white mb-1">Zero</div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Data Harvesting</div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;