import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PulsePageProps {
  onTriggerStageTap: () => void;
}

export const PulsePage: React.FC<PulsePageProps> = ({ onTriggerStageTap }) => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= 95) {
          setDirection(-1);
          return 95;
        }
        if (prev <= 5) {
          setDirection(1);
          return 5;
        }
        return prev + direction * 4;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  const handleStart = () => {
    setIsPlaying(true);
    setScore(null);
    setHasWon(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    // Target zone is centered between 42% and 58%
    const distFromCenter = Math.abs(position - 50);
    const accuracy = Math.max(0, Math.round(100 - distFromCenter * 2.5));
    setScore(accuracy);

    if (distFromCenter < 8) {
      setHasWon(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onTriggerStageTap();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          REFLEX TARGET MINI-GAME
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-['Unbounded'] tracking-tight mb-2">
          Pulse 250 Challenge
        </h1>
        <p className="text-xs sm:text-sm text-[#8a93a8] font-mono">
          Stop the pulse indicator inside the green target zone to unlock voucher code <span className="text-amber-400 font-bold">PULSE250</span> (10% off) and trigger a live Stage Tap on the flywheel!
        </p>
      </div>

      <div className="bg-[#0f1118] border border-[#1f2433] rounded-2xl p-8 text-center space-y-6">
        {/* Track */}
        <div className="relative w-full h-12 bg-[#07080b] rounded-xl border border-[#1f2433] overflow-hidden flex items-center px-2">
          {/* Target Zone */}
          <div
            className="absolute top-0 bottom-0 bg-[#10b981]/25 border-x-2 border-[#10b981] flex items-center justify-center text-[10px] font-mono text-[#34d399]"
            style={{ left: '42%', width: '16%' }}
          >
            TARGET
          </div>

          {/* Pulse Indicator */}
          <div
            className="absolute top-1 bottom-1 w-4 rounded-md bg-amber-400 shadow-lg shadow-amber-400/50 transition-all duration-75"
            style={{ left: `${position}%` }}
          ></div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-3">
          {!isPlaying ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-bold font-mono text-sm transition-all shadow-lg shadow-amber-900/30"
            >
              Start Pulse
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-8 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold font-mono text-sm transition-all shadow-lg shadow-rose-900/30 animate-pulse"
            >
              HIT NOW!
            </button>
          )}
        </div>

        {/* Score & Voucher */}
        {score !== null && (
          <div className="p-4 rounded-xl bg-[#141722] border border-[#1f2433] space-y-2">
            <div className="text-xs font-mono text-[#8a93a8]">
              Accuracy: <span className="text-white font-bold">{score}%</span>
            </div>

            {hasWon ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold font-mono">
                  <Trophy className="w-4 h-4" />
                  PERFECT HIT! 10% VOUCHER UNLOCKED
                </div>
                <div className="p-2 rounded bg-black/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs inline-block">
                  VOUCHER CODE: <span className="font-bold text-white">PULSE250</span>
                </div>
                <div className="text-[11px] text-[#8a93a8] font-mono">
                  ⚡ Live Stage Tap triggered on-chain! 0.015 SOL allocated to $BASH buyback reserve.
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8a93a8] font-mono">
                Missed the center zone! Try again to unlock the voucher.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
