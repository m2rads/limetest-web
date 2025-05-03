"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { IconCopy, IconCheck, IconLemon, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

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

      {/* Header with Navigation Bar */}
      <header className="py-4 px-6 relative z-10">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - Logo and Text */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-lime-500/30 to-lime-300/20 dark:from-lime-500/20 dark:to-lime-400/10 
                w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <IconLemon 
                  size={20} 
                  className="text-lime-600 dark:text-lime-400 transition-transform duration-300 group-hover:rotate-12" 
                  stroke={1.5} 
                />
              </div>
              <span className="font-bold text-lg text-foreground">limetest</span>
            </Link>
          </div>
          
          {/* Middle - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/product" 
              className="text-foreground/80 hover:text-lime-500 dark:hover:text-lime-400 transition-colors"
            >
              Product
            </Link>
            <Link 
              href="/docs" 
              className="text-foreground/80 hover:text-lime-500 dark:hover:text-lime-400 transition-colors"
            >
              Docs
            </Link>
          </div>
          
          {/* Right - GitHub and Get Started */}
          <div className="flex items-center space-x-4">
            <Link 
              href="https://github.com/lime-test/limetest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <IconBrandGithub size={20} />
            </Link>
            <Link 
              href="/get-started" 
              className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10">
        {/* NPM Install (moved from below and made smaller) */}
        <div 
          className={`mb-8 w-full max-w-sm
          transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <div 
            onClick={handleCopy}
            className="bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-lg p-3 font-mono text-xs sm:text-sm cursor-pointer relative group overflow-hidden flex items-center hover:shadow-md transition-all duration-300 backdrop-blur-sm"
          >
            <div className="mr-2 text-lime-500 dark:text-lime-400">$</div>
            <code>npm install @limetest/limetest</code>
            
            <div 
              className={`absolute right-3 flex items-center justify-center transition-all duration-300 ease-in-out ${copied ? 'scale-110' : 'scale-100'}`}
            >
              {copied ? (
                <IconCheck size={16} className="text-lime-500 dark:text-lime-400" stroke={2} />
              ) : (
                <IconCopy size={16} className="text-foreground/50 group-hover:text-foreground/80" stroke={1.5} />
              )}
            </div>
            
            <div className={`absolute inset-0 bg-lime-500/5 transform origin-left transition-transform duration-500 ease-in-out ${copied ? 'scale-x-100' : 'scale-x-0'}`}></div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-lime-500 dark:bg-lime-400 w-0 group-hover:w-full transition-all duration-300"></div>
          </div>
          
          <div className={`mt-1 text-xs text-center transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
            Copied to clipboard!
          </div>
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
        
        {/* Get Started CTA Button */}
        <div 
          className={`transition-all duration-700 delay-450 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <Link 
            href="/get-started" 
            className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white px-8 py-3 rounded-lg transition-colors shadow-md text-lg font-medium"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-foreground/50 relative z-10">
        <p>@limetest/limetest • Modern E2E Testing Framework</p>
      </footer>
    </div>
  );
}
