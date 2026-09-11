import React from 'react';
import {
  Flame,
  Cloud,
  Layers,
  Activity,
  ShieldCheck,
  CreditCard,
  Gamepad2,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import type { TokenLiveState, GcpMiningFleetSummary } from '../types';

interface SiteNavProps {
  activeTab: 'flywheel' | 'syndicate' | 'gcloud' | 'contract' | 'home' | 'transparency' | 'pricing' | 'pulse';
  setActiveTab: (tab: 'flywheel' | 'syndicate' | 'gcloud' | 'contract' | 'home' | 'transparency' | 'pricing' | 'pulse') => void;
  tokenState: TokenLiveState | null;
  fleetSummary: GcpMiningFleetSummary | null;
  onOpenDirectorModal?: () => void;
}

export const SiteNav: React.FC<SiteNavProps> = ({
  activeTab,
  setActiveTab,
  tokenState,
  fleetSummary,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#07080b]/90 backdrop-blur-md border-b border-[#1f2433]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#3b82f6]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] group-hover:border-[#10b981] transition-colors">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-sm sm:text-base font-['Unbounded']">
                <span>TOKEN PUMP</span>
                <span className="text-[#10b981] text-xs px-1.5 py-0.5 rounded bg-[#10b981]/15 border border-[#10b981]/30">
                  ENGINE
                </span>
              </div>
              <div className="text-[10px] text-[#8a93a8] font-mono tracking-wider flex items-center gap-1">
                <span>$BASH</span>
                <span className="text-[#3b82f6]">· Base44 MINING FLYWHEEL</span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('flywheel')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'flywheel'
                ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Flywheel Engine
          </button>

          <button
            onClick={() => setActiveTab('syndicate')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'syndicate'
                ? 'bg-[#f59e0b]/15 text-amber-300 border border-[#f59e0b]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Syndicate & 50/35 Bot
          </button>

          <button
            onClick={() => setActiveTab('gcloud')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'gcloud'
                ? 'bg-[#4285F4]/15 text-[#93c5fd] border border-[#4285F4]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-[#4285F4]" />
            Base44 Mining Fleet
            {fleetSummary && (
              <span className="text-[10px] px-1 rounded bg-[#4285F4]/30 text-blue-200">
                {fleetSummary.runningInstances}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'contract'
                ? 'bg-[#8b5cf6]/15 text-purple-300 border border-[#8b5cf6]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            Audited Contract
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-[#141722] text-white border border-[#1f2433]'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Foundry
          </button>

          <button
            onClick={() => setActiveTab('transparency')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'transparency'
                ? 'bg-[#141722] text-white border border-[#1f2433]'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Ledger & Audit
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'bg-[#141722] text-white border border-[#1f2433]'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pricing
          </button>

          <button
            onClick={() => setActiveTab('pulse')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'pulse'
                ? 'bg-[#141722] text-[#f59e0b] border border-[#f59e0b]/40'
                : 'text-[#8a93a8] hover:text-white hover:bg-[#141722]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Pulse 250
          </button>
        </nav>

        {/* Live Metrics & pump.fun button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Base44 Fleet Hashrate Pill */}
          {fleetSummary && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0f1118] border border-[#1f2433] text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[#8a93a8]">Fleet:</span>
              <span className="text-white font-medium">{fleetSummary.totalRandomXKhs} kH/s</span>
            </div>
          )}

          {/* Token Price / Pump pill */}
          {tokenState && (
            <a
              href={tokenState.pumpFunUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/40 text-xs font-mono text-[#34d399] transition-all group"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#8a93a8]">MCAP</span>
                <span className="font-bold text-white leading-tight">
                  ${(tokenState.marketCapUsd / 1000).toFixed(1)}k
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#1f2433] px-2 py-1.5 bg-[#0b0c10] text-[11px] font-mono overflow-x-auto">
        <button
          onClick={() => setActiveTab('flywheel')}
          className={`px-2 py-1 rounded shrink-0 ${activeTab === 'flywheel' ? 'text-[#34d399] bg-[#10b981]/20' : 'text-[#8a93a8]'}`}
        >
          Flywheel
        </button>
        <button
          onClick={() => setActiveTab('syndicate')}
          className={`px-2 py-1 rounded shrink-0 ${activeTab === 'syndicate' ? 'text-amber-400 bg-amber-500/20' : 'text-[#8a93a8]'}`}
        >
          Syndicate & 50/35
        </button>
        <button
          onClick={() => setActiveTab('gcloud')}
          className={`px-2 py-1 rounded shrink-0 ${activeTab === 'gcloud' ? 'text-blue-400 bg-blue-500/20' : 'text-[#8a93a8]'}`}
        >
          Base44 Fleet
        </button>
        <button
          onClick={() => setActiveTab('contract')}
          className={`px-2 py-1 rounded shrink-0 ${activeTab === 'contract' ? 'text-purple-400 bg-purple-500/20' : 'text-[#8a93a8]'}`}
        >
          Contract
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 rounded ${activeTab === 'home' ? 'text-white bg-white/10' : 'text-[#8a93a8]'}`}
        >
          Foundry
        </button>
        <button
          onClick={() => setActiveTab('transparency')}
          className={`px-2 py-1 rounded ${activeTab === 'transparency' ? 'text-white bg-white/10' : 'text-[#8a93a8]'}`}
        >
          Ledger
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-2 py-1 rounded ${activeTab === 'pricing' ? 'text-white bg-white/10' : 'text-[#8a93a8]'}`}
        >
          Pricing
        </button>
        <button
          onClick={() => setActiveTab('pulse')}
          className={`px-2 py-1 rounded ${activeTab === 'pulse' ? 'text-amber-400 bg-amber-500/20' : 'text-[#8a93a8]'}`}
        >
          Pulse
        </button>
      </div>
    </header>
  );
};
