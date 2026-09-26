import React, { useState } from 'react';
import { WowCore } from '../three/WowCore';
import { Button } from '../common/Button';
import { AuraLifeLogo } from '../common/AuraLifeLogo';
import { ArrowRight, RotateCcw, Sparkles, MessageSquare } from 'lucide-react';

interface LandingHeroProps {
  onEnterWorkspace: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterWorkspace }) => {
  const [coreKey, setCoreKey] = useState(0);

  const handleRestartAnimation = () => {
    setCoreKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0C0E] text-[#EDEFF2] flex flex-col justify-between overflow-hidden">
      {/* Top Fixed Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[#26292F] bg-[#141619]/80 backdrop-blur-md px-6 sm:px-10">
        {/* Brand with Stylish Logo */}
        <AuraLifeLogo size="md" />

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3AAB5]">
          <button
            onClick={onEnterWorkspace}
            className="hover:text-[#EDEFF2] transition-colors"
          >
            Product
          </button>
          <button
            onClick={onEnterWorkspace}
            className="hover:text-[#EDEFF2] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={onEnterWorkspace}
            className="hover:text-[#EDEFF2] transition-colors flex items-center gap-1.5 text-[#5B7FFF]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B7FFF] animate-pulse" />
            Live Demo
          </button>
          <button
            onClick={onEnterWorkspace}
            className="hover:text-[#EDEFF2] transition-colors"
          >
            Company
          </button>
        </div>

        {/* Far Right CTA */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEnterWorkspace}
            className="text-xs font-semibold"
          >
            Log in
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onEnterWorkspace}
            className="rounded-full px-4 text-xs font-semibold shadow-md shadow-[#5B7FFF]/25"
          >
            Try AuraLife
          </Button>
        </div>
      </nav>

      {/* Main Full-Viewport Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center z-10">
        {/* Spiral-Galaxy Core 3D Backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 z-0">
          <div className="relative w-full max-w-4xl h-[520px]">
            <WowCore
              key={coreKey}
              state="IDLE"
              size="hero"
              audioLevels={{ bass: 0.1, mid: 0.08, treble: 0.05, overall: 0.08 }}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Hero Copy (positioned so it reads clearly with subtle radial backing) */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#26292F] bg-[#141619]/90 px-3.5 py-1.5 text-xs text-[#A3AAB5] shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#5B7FFF] animate-pulse" />
            <span>Autonomous Multi-Speaker Voice Intelligence</span>
          </div>

          {/* Big Headline - Tagline from spec */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#EDEFF2] leading-[1.08] mb-6">
            AuraLife turns conversations{' '}
            <span className="bg-gradient-to-r from-[#EDEFF2] via-[#9FB4FF] to-[#5B7FFF] bg-clip-text text-transparent">
              into action.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-xl text-base sm:text-lg text-[#A3AAB5] font-normal leading-relaxed mb-8">
            Real-time multi-speaker transcription, instant cross-lingual translation, automatic decision logging, and task assignment with zero friction.
          </p>

          {/* Main CTA Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={onEnterWorkspace}
              icon={<ArrowRight className="h-5 w-5" />}
              className="rounded-2xl px-7 py-3.5 text-base font-bold shadow-xl shadow-[#5B7FFF]/30 hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              Enter Live Workspace
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={onEnterWorkspace}
              className="rounded-2xl px-6 py-3.5 text-sm font-semibold"
            >
              Watch 45s Scripted Demo
            </Button>
          </div>
        </div>

        {/* Small circular replay affordance in bottom-right (Section 7 polish requirement) */}
        <button
          onClick={handleRestartAnimation}
          className="fixed bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#26292F] bg-[#141619]/90 text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24] transition-all shadow-xl backdrop-blur-md"
          title="Replay core galaxy animation"
          aria-label="Replay core galaxy animation"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </main>
    </div>
  );
};
