import React, { useState } from 'react';
import {
  Flame,
  Zap,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Shield,
  Coins,
  Cpu,
  Wallet,
  Play,
  Pause,
  Layers,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SyndicateWallet, RebalanceCycleState, TokenLiveState, GcpMiningFleetSummary } from '../types';

interface SyndicatePanelProps {
  wallets: SyndicateWallet[];
  rebalanceCycle: RebalanceCycleState | null;
  tokenState: TokenLiveState | null;
  fleetSummary: GcpMiningFleetSummary | null;
  onRefresh: () => void;
}

export const SyndicatePanel: React.FC<SyndicatePanelProps> = ({
  wallets,
  rebalanceCycle,
  tokenState,
  fleetSummary,
  onRefresh,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const solPrice = tokenState ? tokenState.solPriceUsd : 148.5;

  const handleStepCycle = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/syndicate/cycle/step', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setActionMessage(`Cycle stepped to: ${data.cycle.currentPhase}!`);
        setTimeout(() => setActionMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAuto = async () => {
    try {
      const current = rebalanceCycle ? rebalanceCycle.autoRebalanceEnabled : true;
      const res = await fetch('/api/syndicate/cycle/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !current }),
      });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`Autonomous Bot is now ${data.autoRebalanceEnabled ? 'ACTIVE' : 'PAUSED'}`);
        setTimeout(() => setActionMessage(null), 2500);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyndicatePump = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/syndicate/pump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSol: 0.08 }),
      });
      const data = await res.json();
      if (data.ok) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        setActionMessage(`Multi-Wallet Pump Executed! ${data.wallet.id} bought ${data.tokensBought.toLocaleString()} $BASH`);
        setTimeout(() => setActionMessage(null), 3500);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalSyndicateSol = wallets.reduce((acc, w) => acc + w.solBalance, 0);
  const totalSyndicateTokens = wallets.reduce((acc, w) => acc + w.tokenBalance, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f1118] via-[#141722] to-[#07080b] border border-[#f59e0b]/40 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              MULTI-WALLET SYNDICATE · 50% PROFIT / 35% DIP REBUY ENGINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Unbounded'] tracking-tight">
              Automated Liquidity Scaling & Dip-Pump Bot
            </h1>
            <p className="text-xs sm:text-sm text-[#8a93a8] font-mono leading-relaxed">
              Orchestrates 6 distributed Google Cloud node burner wallets pumping the $BASH curve. 
              Automatically takes profit (50% sold to Main Treasury), identifies curve dips, and deploys 35% + fresh mining SOL directly at the low to compound bonding curve velocity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleAuto}
              className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                rebalanceCycle?.autoRebalanceEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
              }`}
            >
              {rebalanceCycle?.autoRebalanceEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <Pause className="w-3.5 h-3.5" />
                  Bot Active (Auto-Loop)
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume Auto-Bot
                </>
              )}
            </button>

            <button
              onClick={handleStepCycle}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-lg bg-[#141722] hover:bg-[#1f2433] border border-[#f59e0b]/50 text-amber-300 font-mono text-xs font-bold transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              Step Cycle Forward
            </button>

            <button
              onClick={handleSyndicatePump}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-900/30"
            >
              <Zap className="w-3.5 h-3.5" />
              Trigger Multi-Wallet Pump (0.08 SOL)
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#141722] border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* 50/35 Rebalance Cycle Visualizer */}
      <div className="bg-[#0f1118] border border-[#1f2433] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Unbounded']">
                Active 50/35 Rebalance Phase Engine
              </h2>
            </div>
            <p className="text-xs text-[#8a93a8] font-mono mt-1">
              Iterative liquidity mechanism: Pump → 50% Profit Withdrawal → Dip Trigger → 35% Rebuy + Mining SOL Re-Injection
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#141722] border border-[#1f2433]">
              <span className="text-[#8a93a8]">Cycle Iteration: </span>
              <span className="text-amber-400 font-bold">#{rebalanceCycle?.cycleIteration || 14}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#141722] border border-[#1f2433]">
              <span className="text-[#8a93a8]">Main Wallet Withdrawn: </span>
              <span className="text-emerald-400 font-bold">
                +{rebalanceCycle?.totalProfitWithdrawnSol.toFixed(2)} SOL
              </span>
            </div>
          </div>
        </div>

        {/* 4-Stage Interactive Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          {/* Phase 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              rebalanceCycle?.currentPhase === 'VOLUME_PUMP'
                ? 'bg-[#141722] border-amber-400/80 shadow-lg shadow-amber-950/30'
                : 'bg-[#0b0c10] border-[#1f2433] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-amber-400 font-bold">PHASE 1</span>
              {rebalanceCycle?.currentPhase === 'VOLUME_PUMP' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </div>
            <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              Volume Pump
            </div>
            <p className="text-[11px] text-[#8a93a8] leading-relaxed">
              Multi-wallet nodes deploy mining SOL into $BASH bonding curve to surge volume and price.
            </p>
            <div className="mt-3 pt-2 border-t border-[#1f2433] text-[10px] text-amber-300">
              Progress: {rebalanceCycle?.phaseProgressPct || 0}%
            </div>
          </div>

          {/* Phase 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              rebalanceCycle?.currentPhase === 'HARVEST_50_MAIN'
                ? 'bg-[#141722] border-emerald-400/80 shadow-lg shadow-emerald-950/30'
                : 'bg-[#0b0c10] border-[#1f2433] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-emerald-400 font-bold">PHASE 2</span>
              {rebalanceCycle?.currentPhase === 'HARVEST_50_MAIN' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>
            <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              50% Sell → Main Wallet
            </div>
            <p className="text-[11px] text-[#8a93a8] leading-relaxed">
              50% of tokens liquidated on curve for SOL; 100% of proceeds sent straight to Creator Wallet.
            </p>
            <div className="mt-3 pt-2 border-t border-[#1f2433] text-[10px] text-emerald-300">
              Last Harvest: {rebalanceCycle?.lastHarvestSol.toFixed(3)} SOL
            </div>
          </div>

          {/* Phase 3 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              rebalanceCycle?.currentPhase === 'DIP_CREATED'
                ? 'bg-[#141722] border-rose-400/80 shadow-lg shadow-rose-950/30'
                : 'bg-[#0b0c10] border-[#1f2433] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-rose-400 font-bold">PHASE 3</span>
              {rebalanceCycle?.currentPhase === 'DIP_CREATED' && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              )}
            </div>
            <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              Dip Triggered
            </div>
            <p className="text-[11px] text-[#8a93a8] leading-relaxed">
              Bonding curve creates an attractive re-entry candle. Snipe algorithms primed.
            </p>
            <div className="mt-3 pt-2 border-t border-[#1f2433] text-[10px] text-rose-300">
              Dip Sniper Primed
            </div>
          </div>

          {/* Phase 4 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              rebalanceCycle?.currentPhase === 'DIP_REBUY_35'
                ? 'bg-[#141722] border-cyan-400/80 shadow-lg shadow-cyan-950/30'
                : 'bg-[#0b0c10] border-[#1f2433] opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-400 font-bold">PHASE 4</span>
              {rebalanceCycle?.currentPhase === 'DIP_REBUY_35' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </div>
            <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              35% + Mining Rebuy Low
            </div>
            <p className="text-[11px] text-[#8a93a8] leading-relaxed">
              35% of remaining sold for SOL + all fresh GCP mining yield deployed to buy dip at low!
            </p>
            <div className="mt-3 pt-2 border-t border-[#1f2433] text-[10px] text-cyan-300">
              Last Dip Buy: {rebalanceCycle?.lastRebuySol.toFixed(3)} SOL
            </div>
          </div>
        </div>

        {/* Realized Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1f2433] font-mono text-xs">
          <div>
            <div className="text-[#8a93a8]">MAIN WALLET HARVESTED</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              +{rebalanceCycle?.totalProfitWithdrawnSol.toFixed(2)} SOL
            </div>
            <div className="text-[10px] text-[#5b6377]">
              ${((rebalanceCycle?.totalProfitWithdrawnSol || 0) * solPrice).toFixed(0)} USD withdrawn
            </div>
          </div>

          <div>
            <div className="text-[#8a93a8]">TOTAL REINVESTED (DIPS)</div>
            <div className="text-base font-bold text-cyan-400 mt-0.5">
              +{rebalanceCycle?.totalReinvestedSol.toFixed(2)} SOL
            </div>
            <div className="text-[10px] text-[#5b6377]">
              35% sold + GCP mining yield
            </div>
          </div>

          <div>
            <div className="text-[#8a93a8]">SYNDICATE CLUSTER SOL</div>
            <div className="text-base font-bold text-white mt-0.5">
              {totalSyndicateSol.toFixed(3)} SOL
            </div>
            <div className="text-[10px] text-[#5b6377]">Across 6 active node wallets</div>
          </div>

          <div>
            <div className="text-[#8a93a8]">SYNDICATE $BASH TOKENS</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              {(totalSyndicateTokens / 1_000_000).toFixed(2)}M $BASH
            </div>
            <div className="text-[10px] text-[#5b6377]">Available for next cycle rebalance</div>
          </div>
        </div>
      </div>

      {/* Multi-Wallet Syndicate Grid */}
      <div className="bg-[#0f1118] border border-[#1f2433] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-['Unbounded']">
                Distributed Node Wallets Cluster
              </h3>
            </div>
            <p className="text-xs text-[#8a93a8] font-mono mt-1">
              Autonomous keypairs bound to Google Cloud compute nodes to distribute buy pressure and bypass bot cluster filters.
            </p>
          </div>

          <div className="text-xs font-mono text-[#8a93a8]">
            Main Destination: <span className="text-white font-bold">{tokenState?.creatorWallet.slice(0, 8)}...</span>
          </div>
        </div>

        {/* Wallets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1f2433] text-[#8a93a8] text-[11px]">
                <th className="pb-3">NODE / WALLET</th>
                <th className="pb-3">ROLE</th>
                <th className="pb-3">SOL BALANCE</th>
                <th className="pb-3">$BASH BALANCE</th>
                <th className="pb-3">PUMPS FIRED</th>
                <th className="pb-3">DEPLOYED SOL</th>
                <th className="pb-3">LAST TX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2433]">
              {wallets.map((w) => (
                <tr key={w.id} className="hover:bg-[#141722]/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-white">{w.label}</div>
                    <div className="text-[10px] text-[#5b6377]">{w.address.slice(0, 16)}...</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        w.role === 'PUMP_INJECTOR'
                          ? 'bg-amber-500/20 text-amber-300'
                          : w.role === 'DIP_REBUYER'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {w.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-bold text-white">
                    {w.solBalance.toFixed(3)} SOL
                  </td>
                  <td className="py-3 pr-4 text-amber-300">
                    {(w.tokenBalance / 1_000_000).toFixed(2)}M $BASH
                  </td>
                  <td className="py-3 pr-4 text-[#8a93a8]">
                    {w.totalPumps}
                  </td>
                  <td className="py-3 pr-4 text-emerald-400 font-bold">
                    {w.totalSolDeployed.toFixed(2)} SOL
                  </td>
                  <td className="py-3 text-[11px]">
                    <a
                      href={`https://solscan.io/tx/${w.lastTxSignature}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{w.lastTxSignature.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
