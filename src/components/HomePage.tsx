import React, { useState } from 'react';
import {
  Flame,
  Cloud,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Zap,
  CheckCircle2,
  ExternalLink,
  Calculator,
} from 'lucide-react';
import type { TokenLiveState, GcpMiningFleetSummary } from '../types';

interface HomePageProps {
  tokenState: TokenLiveState | null;
  fleetSummary: GcpMiningFleetSummary | null;
  onNavigate: (tab: 'flywheel' | 'gcloud' | 'pricing' | 'transparency') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tokenState,
  fleetSummary,
  onNavigate,
}) => {
  // Interactive Audit Calculator State
  const [calcMonthlyRev, setCalcMonthlyRev] = useState(15000);
  const [calcGceNodes, setCalcGceNodes] = useState(4);

  const solPrice = tokenState ? tokenState.solPriceUsd : 148.5;
  const monthlyProductBuybacksUsd = calcMonthlyRev * 0.15;
  const monthlyMiningBuybacksSol = calcGceNodes * 0.0125 * 30;
  const monthlyMiningBuybacksUsd = monthlyMiningBuybacksSol * solPrice;
  const totalMonthlyBuybackUsd = monthlyProductBuybacksUsd + monthlyMiningBuybacksUsd;
  const totalMonthlyBuybackSol = totalMonthlyBuybackUsd / solPrice;

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f1118] to-[#07080b] border border-[#1f2433] p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#34d399] text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            $BASH AUTONOMOUS FOUNDRY & GOOGLE CLOUD MINING FLYWHEEL
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-['Unbounded'] leading-tight mb-4">
            The Autonomous Token Pump Engine.
          </h1>

          <p className="text-base sm:text-lg text-[#8a93a8] leading-relaxed mb-8">
            An institutional-grade product foundry married with an autonomous Google Cloud Compute Engine mining fleet. 
            15% of all software revenue and 100% of mining payouts are liquidated to native SOL and deployed straight into the $BASH bonding curve on pump.fun.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('flywheel')}
              className="px-6 py-3 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-bold font-mono text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <Flame className="w-4 h-4" />
              Launch Flywheel Engine
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('gcloud')}
              className="px-6 py-3 rounded-lg bg-[#141722] hover:bg-[#1f2433] border border-[#4285F4]/40 text-[#93c5fd] font-mono text-sm transition-all flex items-center gap-2"
            >
              <Cloud className="w-4 h-4 text-[#4285F4]" />
              Manage GCP Fleet
            </button>

            {tokenState && (
              <a
                href={tokenState.pumpFunUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg bg-[#141722] hover:bg-[#1f2433] border border-[#1f2433] text-white font-mono text-sm transition-all flex items-center gap-2"
              >
                <span>View on pump.fun</span>
                <ExternalLink className="w-4 h-4 text-[#8a93a8]" />
              </a>
            )}
          </div>
        </div>

        {/* Live Market Bar */}
        {tokenState && (
          <div className="mt-10 pt-8 border-t border-[#1f2433] grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-[#8a93a8] font-mono">BONDING CURVE PROGRESS</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {tokenState.bondingCurveProgressPct}%
              </div>
              <div className="text-[10px] text-amber-400">
                {tokenState.virtualSolReserves.toFixed(1)} / 85.0 SOL
              </div>
            </div>

            <div>
              <div className="text-[11px] text-[#8a93a8] font-mono">MARKET CAPITALIZATION</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                ${(tokenState.marketCapUsd / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-[#5b6377]">Constant product model</div>
            </div>

            <div>
              <div className="text-[11px] text-[#8a93a8] font-mono">GCP MINING HASHRATE</div>
              <div className="text-xl font-bold font-mono text-[#93c5fd] mt-1">
                {fleetSummary ? fleetSummary.totalRandomXKhs : '30.4'} kH/s
              </div>
              <div className="text-[10px] text-blue-300">Spot VMs (C2/T2D/G2)</div>
            </div>

            <div>
              <div className="text-[11px] text-[#8a93a8] font-mono">24H VOLUME</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                ${(tokenState.volume24hUsd / 1000).toFixed(1)}k
              </div>
              <div className="text-[10px] text-emerald-400">+{tokenState.change24hPct}% momentum</div>
            </div>
          </div>
        )}
      </div>

      {/* 8-Stage Autonomous Foundry Architecture */}
      <div className="bg-[#0f1118] border border-[#1f2433] rounded-2xl p-8">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Unbounded']">
            The 8-Stage Autonomous Foundry Pipeline
          </h2>
          <p className="text-xs text-[#8a93a8] mt-1 font-mono">
            How software products are generated, validated, deployed, and monetized to fuel continuous $BASH buybacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#141722] p-4 rounded-xl border border-[#1f2433]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#10b981] font-bold">STAGE 1-2</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#8a93a8]">INTENT</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">PRD & Specification</div>
            <p className="text-[#8a93a8] text-[11px] leading-relaxed">
              AI evaluates user prompts, creates formal PRD specifications, and defines acceptance criteria.
            </p>
          </div>

          <div className="bg-[#141722] p-4 rounded-xl border border-[#1f2433]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-bold">STAGE 3-4</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#8a93a8]">BUILD</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">Code & Static Analysis</div>
            <p className="text-[#8a93a8] text-[11px] leading-relaxed">
              Full-stack TypeScript and Python generation with automated AST linting and typechecking.
            </p>
          </div>

          <div className="bg-[#141722] p-4 rounded-xl border border-[#1f2433]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-400 font-bold">STAGE 5-6</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#8a93a8]">VERIFY</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">Sandbox Gate & Security</div>
            <p className="text-[#8a93a8] text-[11px] leading-relaxed">
              Container sandboxing, unit testing, and vulnerability auditing before code release.
            </p>
          </div>

          <div className="bg-[#141722] p-4 rounded-xl border border-[#1f2433]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-bold">STAGE 7-8</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#8a93a8]">MONETIZE</span>
            </div>
            <div className="text-sm font-bold text-white mb-1">Deploy & 15% Buyback</div>
            <p className="text-[#8a93a8] text-[11px] leading-relaxed">
              Cloud Run launch, payment billing, and automated 15% revenue conversion directly into $BASH.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Audit Calculator */}
      <div className="bg-[#0f1118] border border-[#1f2433] rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white font-['Unbounded']">
            Buyback Pressure Audit Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[#8a93a8] mb-2">
                <span>Monthly Product Foundry Revenue:</span>
                <span className="text-white font-bold">${calcMonthlyRev.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min={2500}
                max={100000}
                step={2500}
                value={calcMonthlyRev}
                onChange={(e) => setCalcMonthlyRev(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-[#141722]"
              />
              <div className="text-[10px] text-[#5b6377] mt-1">15% ($ {(calcMonthlyRev * 0.15).toLocaleString()}) allocated straight to buybacks</div>
            </div>

            <div>
              <div className="flex justify-between text-[#8a93a8] mb-2">
                <span>Google Cloud Mining Fleet Size:</span>
                <span className="text-blue-400 font-bold">{calcGceNodes} GCE Compute Nodes</span>
              </div>
              <input
                type="range"
                min={1}
                max={32}
                step={1}
                value={calcGceNodes}
                onChange={(e) => setCalcGceNodes(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-[#141722]"
              />
              <div className="text-[10px] text-[#5b6377] mt-1">
                Generates ~{(calcGceNodes * 0.0125).toFixed(3)} SOL/day (~{(calcGceNodes * 0.0125 * 30).toFixed(2)} SOL/mo)
              </div>
            </div>
          </div>

          <div className="bg-[#141722] p-6 rounded-xl border border-[#1f2433] flex flex-col justify-between">
            <div className="space-y-4 font-mono text-xs">
              <div className="text-[#8a93a8]">PROJECTED MONTHLY BUYBACK PRESSURE:</div>
              <div className="text-3xl font-bold text-white">
                {totalMonthlyBuybackSol.toFixed(2)}{' '}
                <span className="text-sm font-normal text-amber-400">SOL / mo</span>
              </div>
              <div className="text-base text-emerald-400 font-semibold">
                ${totalMonthlyBuybackUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD monthly purchase volume
              </div>

              <div className="pt-4 border-t border-[#1f2433] text-[11px] text-[#8a93a8] space-y-1">
                <div className="flex justify-between">
                  <span>Product Revenue Share:</span>
                  <span className="text-white">${monthlyProductBuybacksUsd.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Cloud Mining Share:</span>
                  <span className="text-white">${monthlyMiningBuybacksUsd.toFixed(0)} USD</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('pricing')}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-bold font-mono text-xs transition-all"
            >
              Fund a Product Tier & Trigger Live Buyback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
