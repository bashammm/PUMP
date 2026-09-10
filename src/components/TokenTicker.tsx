import React from 'react';
import { ArrowUpRight, Shield, Zap, Coins, Server, Cpu } from 'lucide-react';
import type { TokenLiveState, FlywheelState, GcpMiningFleetSummary } from '../types';

interface TokenTickerProps {
  tokenState: TokenLiveState | null;
  flywheelState: FlywheelState | null;
  fleetSummary: GcpMiningFleetSummary | null;
}

export const TokenTicker: React.FC<TokenTickerProps> = ({
  tokenState,
  flywheelState,
  fleetSummary,
}) => {
  if (!tokenState) return null;

  return (
    <div className="bg-[#0b0c10] border-b border-[#1f2433] text-xs font-mono py-2 px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          {/* Token Symbol & Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">{tokenState.symbol}</span>
            <span className="text-[#34d399] font-medium">
              ${tokenState.priceUsd < 0.00001 ? tokenState.priceUsd.toExponential(4) : tokenState.priceUsd.toFixed(8)}
            </span>
            <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
              <ArrowUpRight className="w-3 h-3" />
              +{tokenState.change24hPct}%
            </span>
          </div>

          {/* SOL Market Price */}
          <div className="hidden sm:flex items-center gap-1.5 text-[#8a93a8]">
            <span>SOL:</span>
            <span className="text-white">${tokenState.solPriceUsd.toFixed(2)}</span>
          </div>

          {/* Bonding Curve Progress */}
          <div className="flex items-center gap-1.5 text-[#8a93a8]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Curve:</span>
            <span className="text-amber-300 font-medium">{tokenState.bondingCurveProgressPct}%</span>
            <span className="text-[10px] text-[#5b6377]">
              ({tokenState.virtualSolReserves.toFixed(1)} / {tokenState.graduationTargetSol} SOL)
            </span>
          </div>

          {/* Buyback Reserve */}
          {flywheelState && (
            <div className="flex items-center gap-1.5 text-[#8a93a8]">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buyback Reserve:</span>
              <span className="text-white font-semibold">{flywheelState.buyback_reserve_sol.toFixed(4)} SOL</span>
              <span className="text-[10px] text-emerald-400">
                (${ (flywheelState.buyback_reserve_sol * tokenState.solPriceUsd).toFixed(2) })
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          {/* Live rig1 Worker */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[#8a93a8]">rig1:</span>
            <span className="text-emerald-400 font-semibold">3.53 kH/s</span>
            <span className="text-[10px] text-emerald-400/80 hidden sm:inline">(unMineable SOL)</span>
          </div>

          {/* Google Cloud Mining Fleet */}
          {fleetSummary && (
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="text-[#8a93a8]">Fleet:</span>
              <span className="text-[#93c5fd] font-medium">
                {fleetSummary.totalRandomXKhs} kH/s
              </span>
              <span className="text-[10px] text-[#5b6377]">
                | {fleetSummary.totalkHeavyHashMhs} MH/s KAS
              </span>
            </div>
          )}

          {/* Governor Status */}
          {flywheelState && (
            <div className="hidden md:flex items-center gap-1.5 text-[#8a93a8]">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Window Injection:</span>
              <span className="text-purple-300">
                {flywheelState.current_window_injected_sol.toFixed(3)} / 0.250 SOL
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
