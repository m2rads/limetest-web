"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { IconCopy, IconCheck, IconLemon } from "@tabler/icons-react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install @limetest/limetest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-radial-subtle">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-400/10 dark:bg-lime-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lime-300/10 dark:bg-lime-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-12 w-72 h-72 bg-lime-200/10 dark:bg-lime-300/5 rounded-full blur-3xl"></div>
        
        {/* Grid patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
        
        {/* Subtle dots */}
        <div className="absolute inset-0 bg-dots-pattern opacity-10 dark:opacity-5"></div>
      </div>

      {/* Header */}
      <header className="flex justify-end p-6 relative z-10">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10">
        <div 
          className={`mb-8 bg-gradient-to-br from-lime-500/30 to-lime-300/20 dark:from-lime-500/20 dark:to-lime-400/10 
          w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-sm
          transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="absolute inset-0 bg-lime-400/10 mix-blend-overlay"></div>
          <IconLemon 
            size={48} 
            className="text-lime-600 dark:text-lime-400 transition-transform duration-300 hover:rotate-12 drop-shadow-sm" 
            stroke={1.5} 
          />
        </div>
        
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6
          transition-all duration-700 delay-150 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          Ship fast and{" "}
          <span className="text-lime-500 dark:text-lime-400 inline-block relative">
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.1s' }}>b</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.2s' }}>r</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.3s' }}>e</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.4s' }}>a</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.5s' }}>k</span>
            <span className="inline-block px-1">{" "}</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.7s' }}>n</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.8s' }}>o</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '0.9s' }}>t</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '1.0s' }}>h</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '1.1s' }}>i</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '1.2s' }}>n</span>
            <span className="inline-block play-once-animate" style={{ animationDelay: '1.3s' }}>g</span>
          </span>
        </h1>
        
        <p 
          className={`text-lg mb-10 text-foreground/80 max-w-2xl
          transition-all duration-700 delay-300 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          End-to-end testing made easy. Write tests that run just like your users 
          would interact with your app.
        </p>
        
        <div 
          className={`w-full max-w-md
          transition-all duration-700 delay-450 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div 
            onClick={handleCopy}
            className="bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-xl p-4 font-mono text-sm sm:text-base cursor-pointer relative group overflow-hidden flex items-center hover:shadow-md transition-all duration-300 backdrop-blur-sm"
          >
            <div className="mr-2 text-lime-500 dark:text-lime-400">$</div>
            <code>npm install @limetest/limetest</code>
            
            <div 
              className={`absolute right-4 flex items-center justify-center transition-all duration-300 ease-in-out ${copied ? 'scale-110' : 'scale-100'}`}
            >
              {copied ? (
                <IconCheck size={18} className="text-lime-500 dark:text-lime-400" stroke={2} />
              ) : (
                <IconCopy size={18} className="text-foreground/50 group-hover:text-foreground/80" stroke={1.5} />
              )}
            </div>
            
            <div className={`absolute inset-0 bg-lime-500/5 transform origin-left transition-transform duration-500 ease-in-out ${copied ? 'scale-x-100' : 'scale-x-0'}`}></div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-lime-500 dark:bg-lime-400 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
          
          <div className={`mt-2 text-xs text-center transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
            Copied to clipboard!
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-foreground/50 relative z-10">
        <p>@limetest/limetest • Modern E2E Testing Framework</p>
      </footer>
    </div>
  );
}
