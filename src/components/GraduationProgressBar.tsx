import React from 'react';
import { Rocket, CheckCircle, ExternalLink, ShieldCheck, Flame } from 'lucide-react';
import type { TokenLiveState, FlywheelState } from '../types';

interface GraduationProgressBarProps {
  tokenState: TokenLiveState | null;
  flywheelState: FlywheelState | null;
}

export const GraduationProgressBar: React.FC<GraduationProgressBarProps> = ({
  tokenState,
  flywheelState,
}) => {
  if (!tokenState) return null;

  const progress = tokenState.bondingCurveProgressPct;
  const target = tokenState.graduationTargetSol;
  const currentSol = tokenState.virtualSolReserves;
  const remainingSol = Math.max(0, target - currentSol);

  return (
    <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-base font-bold text-white font-['Unbounded']">
              pump.fun Graduation Progress
            </h2>
          </div>
          <p className="text-xs text-[#8a93a8] mt-0.5">
            At 85 SOL (~$12,600 liquidity), pump.fun deposits all collateral into Raydium and burns LP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold font-mono text-fuchsia-400">
            {progress.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Main Track Bar */}
      <div className="relative w-full h-4 bg-[#07080b] rounded-full overflow-hidden mb-3 border border-[#1f2433] p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#ec4899] transition-all duration-700 shadow-lg shadow-fuchsia-500/20"
          style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
        ></div>
      </div>

      {/* Breakdown metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
        <div className="bg-[#141722] p-2.5 rounded-lg border border-[#1f2433]">
          <div className="text-[#8a93a8] text-[10px]">CURRENT BONDING SOL</div>
          <div className="text-white font-bold mt-0.5">{currentSol.toFixed(2)} SOL</div>
          <div className="text-[10px] text-[#5b6377]">
            ${(currentSol * tokenState.solPriceUsd).toFixed(0)} USD
          </div>
        </div>

        <div className="bg-[#141722] p-2.5 rounded-lg border border-[#1f2433]">
          <div className="text-[#8a93a8] text-[10px]">REMAINING TO GRADUATE</div>
          <div className="text-amber-400 font-bold mt-0.5">{remainingSol.toFixed(2)} SOL</div>
          <div className="text-[10px] text-[#5b6377]">
            ${(remainingSol * tokenState.solPriceUsd).toFixed(0)} USD
          </div>
        </div>

        <div className="bg-[#141722] p-2.5 rounded-lg border border-[#1f2433]">
          <div className="text-[#8a93a8] text-[10px]">TOKENS BURNED ($BASH)</div>
          <div className="text-rose-400 font-bold mt-0.5 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {flywheelState ? (flywheelState.total_tokens_burned / 1_000_000).toFixed(1) : '139.2'}M
          </div>
          <div className="text-[10px] text-[#5b6377]">Permanent deflation</div>
        </div>

        <div className="bg-[#141722] p-2.5 rounded-lg border border-[#1f2433]">
          <div className="text-[#8a93a8] text-[10px]">TARGET RAYDIUM DEX</div>
          <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            85.00 SOL
          </div>
          <div className="text-[10px] text-[#5b6377]">Raydium CPMM Pool</div>
        </div>
      </div>
    </div>
  );
};
