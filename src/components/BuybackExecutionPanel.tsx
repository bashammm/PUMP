import React, { useState } from 'react';
import {
  Coins,
  Shield,
  FastForward,
  Flame,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FlywheelState, TokenLiveState, FlywheelConfig } from '../types';

interface BuybackExecutionPanelProps {
  flywheelState: FlywheelState | null;
  tokenState: TokenLiveState | null;
  config: FlywheelConfig | null;
  onRefresh: () => void;
}

export const BuybackExecutionPanel: React.FC<BuybackExecutionPanelProps> = ({
  flywheelState,
  tokenState,
  config,
  onRefresh,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const solPrice = tokenState ? tokenState.solPriceUsd : 148.5;

  const handleManualInject = async () => {
    try {
      setLoadingAction('inject');
      setMessage(null);
      const res = await fetch('/api/flywheel/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSol: 0.05, source: 'director_manual_injection' }),
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        setMessage({
          type: 'success',
          text: `Successfully injected ${data.injectedSol.toFixed(4)} SOL ($${(data.injectedSol * solPrice).toFixed(2)}) into pump.fun bonding curve!`,
        });
        onRefresh();
      } else {
        setMessage({
          type: 'error',
          text: data.reason || 'Injection rejected by Capacity Governor.',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Execution failed' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFastForward = async () => {
    try {
      setLoadingAction('fast_forward');
      setMessage(null);
      const res = await fetch('/api/flywheel/fast-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({
          type: 'success',
          text: `Fast-forwarded 1 Hour: Accrued +${data.accruedSol.toFixed(4)} SOL from Base44 Fleet. Window rolled.`,
        });
        onRefresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConvertPool = async () => {
    try {
      setLoadingAction('convert');
      setMessage(null);
      const res = await fetch('/api/flywheel/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({
          type: 'success',
          text: `Converted pool rewards: +${data.convertedSol.toFixed(4)} SOL moved to buyback reserve!`,
        });
        onRefresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleStageTapLoop = async () => {
    try {
      setLoadingAction('stage_tap');
      setMessage(null);
      const res = await fetch('/api/cycle/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({
          type: 'success',
          text: `Executed 8-stage foundry pipeline: 0.015 SOL tapped and queued for buyback!`,
        });
        onRefresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoadingAction(null);
    }
  };

  if (!flywheelState) return null;

  const cap = config ? config.governor_cap_sol : 0.25;
  const currentWindow = flywheelState.current_window_injected_sol;
  const windowPct = Math.min(100, (currentWindow / cap) * 100);
  const remainingWindowSol = Math.max(0, cap - currentWindow);

  return (
    <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white font-['Unbounded']">
              Buyback Execution & Governor
            </h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            AUTO-CYCLE ACTIVE
          </span>
        </div>

        {/* Two-column status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Card 1: Buyback Reserve */}
          <div className="bg-[#141722] border border-[#1f2433] rounded-lg p-4">
            <div className="flex items-center justify-between text-xs text-[#8a93a8] font-mono mb-1">
              <span>UNSPENT BUYBACK RESERVE</span>
              <span className="text-amber-400 font-semibold">
                ${(flywheelState.buyback_reserve_sol * solPrice).toFixed(2)}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mb-2">
              {flywheelState.buyback_reserve_sol.toFixed(4)}{' '}
              <span className="text-xs text-amber-400 font-normal">SOL</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5b6377] font-mono border-t border-[#1f2433] pt-2">
              <span>Lifetime Injected:</span>
              <span className="text-emerald-400 font-semibold">
                {flywheelState.total_injected_sol.toFixed(3)} SOL (${(flywheelState.total_injected_sol * solPrice).toFixed(0)})
              </span>
            </div>
          </div>

          {/* Card 2: Capacity Governor */}
          <div className="bg-[#141722] border border-[#1f2433] rounded-lg p-4">
            <div className="flex items-center justify-between text-xs text-[#8a93a8] font-mono mb-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                GOVERNOR WINDOW CAP
              </span>
              <span className="text-purple-300 font-mono">
                {remainingWindowSol.toFixed(3)} SOL left
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-[#0b0c10] rounded-full overflow-hidden mb-2 border border-[#1f2433]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  windowPct > 85 ? 'bg-rose-500' : windowPct > 50 ? 'bg-amber-400' : 'bg-purple-500'
                }`}
                style={{ width: `${windowPct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8a93a8] font-mono">
              <span>
                Window: {currentWindow.toFixed(3)} / {cap.toFixed(3)} SOL
              </span>
              <span className="text-purple-400">{windowPct.toFixed(0)}% Utilized</span>
            </div>
          </div>
        </div>

        {/* Feedback message banner */}
        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-mono mb-4 flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#1f2433]">
        <button
          onClick={handleManualInject}
          disabled={loadingAction !== null || flywheelState.buyback_reserve_sol < 0.005}
          className="px-3 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-black font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
        >
          {loadingAction === 'inject' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Flame className="w-3.5 h-3.5" />
          )}
          Manual Inject
        </button>

        <button
          onClick={handleFastForward}
          disabled={loadingAction !== null}
          className="px-3 py-2 rounded-lg bg-[#141722] hover:bg-[#1f2433] text-white border border-[#1f2433] text-xs font-mono transition-all flex items-center justify-center gap-1.5"
        >
          {loadingAction === 'fast_forward' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          )}
          +1h Fast-Forward
        </button>

        <button
          onClick={handleConvertPool}
          disabled={loadingAction !== null}
          className="px-3 py-2 rounded-lg bg-[#141722] hover:bg-[#1f2433] text-white border border-[#1f2433] text-xs font-mono transition-all flex items-center justify-center gap-1.5"
        >
          {loadingAction === 'convert' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          )}
          Convert Rewards
        </button>

        <button
          onClick={handleStageTapLoop}
          disabled={loadingAction !== null}
          className="px-3 py-2 rounded-lg bg-[#141722] hover:bg-[#1f2433] text-white border border-[#1f2433] text-xs font-mono transition-all flex items-center justify-center gap-1.5"
        >
          {loadingAction === 'stage_tap' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          )}
          Stage 1-8 Loop
        </button>
      </div>
    </div>
  );
};
