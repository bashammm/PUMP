import React, { useState } from 'react';
import {
  ListFilter,
  Flame,
  Clock,
  ExternalLink,
  ShieldAlert,
  Coins,
  ArrowDownRight,
  Cloud,
} from 'lucide-react';
import type { LedgerEntry } from '../types';

interface LedgerTableProps {
  ledger: LedgerEntry[];
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ ledger }) => {
  const [filter, setFilter] = useState<'all' | 'injection' | 'allocation' | 'delay'>('all');

  const filtered = ledger.filter((entry) => {
    if (filter === 'all') return true;
    if (filter === 'injection') return entry.type === 'injection';
    if (filter === 'allocation') return entry.type === 'allocation' || entry.type === 'gcp_mining';
    if (filter === 'delay') return entry.type === 'delay' || entry.type === 'window_roll';
    return true;
  });

  return (
    <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-['Unbounded']">
              On-Chain Buyback & Telemetry Ledger
            </h2>
          </div>
          <p className="text-xs text-[#8a93a8] mt-0.5">
            Immutable log of bonding curve buys, GCP mining liquidations, and governor events
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-lg border border-[#1f2433] text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition-all ${
              filter === 'all' ? 'bg-white/10 text-white font-semibold' : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('injection')}
            className={`px-2.5 py-1 rounded transition-all ${
              filter === 'injection'
                ? 'bg-rose-500/20 text-rose-300 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            Injections
          </button>
          <button
            onClick={() => setFilter('allocation')}
            className={`px-2.5 py-1 rounded transition-all ${
              filter === 'allocation'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            Allocations
          </button>
          <button
            onClick={() => setFilter('delay')}
            className={`px-2.5 py-1 rounded transition-all ${
              filter === 'delay'
                ? 'bg-purple-500/20 text-purple-300 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            Governor
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#1f2433] text-[#8a93a8] text-[11px]">
              <th className="pb-2 font-medium">TYPE</th>
              <th className="pb-2 font-medium">AMOUNT</th>
              <th className="pb-2 font-medium">SOURCE / DETAILS</th>
              <th className="pb-2 font-medium">RESERVE AFTER</th>
              <th className="pb-2 font-medium">TIMESTAMP</th>
              <th className="pb-2 font-medium text-right">SIGNATURE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2433]/50">
            {filtered.map((item) => {
              const date = new Date(item.timestamp);
              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              return (
                <tr key={item.id} className="hover:bg-[#141722]/60 transition-colors">
                  <td className="py-3 pr-3">
                    {item.type === 'injection' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-[10px]">
                        <Flame className="w-3 h-3" />
                        INJECT
                      </span>
                    )}
                    {(item.type === 'allocation' || item.type === 'gcp_mining') && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                        <Coins className="w-3 h-3" />
                        ALLOC
                      </span>
                    )}
                    {item.type === 'delay' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold text-[10px]">
                        <Clock className="w-3 h-3" />
                        DELAY
                      </span>
                    )}
                    {item.type === 'window_roll' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-[10px]">
                        <ShieldAlert className="w-3 h-3" />
                        ROLL
                      </span>
                    )}
                    {item.type === 'stage_tap' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold text-[10px]">
                        <Coins className="w-3 h-3" />
                        STAGE
                      </span>
                    )}
                  </td>

                  <td className="py-3 pr-3 font-semibold text-white">
                    {item.amountSol > 0 ? (
                      <div>
                        <div>{item.amountSol.toFixed(4)} SOL</div>
                        <div className="text-[10px] text-[#5b6377] font-normal">
                          ${item.amountUsd.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#5b6377]">--</span>
                    )}
                  </td>

                  <td className="py-3 pr-3 max-w-xs sm:max-w-md">
                    <div className="text-[#e0e2ec] font-medium truncate">{item.details}</div>
                    <div className="text-[10px] text-[#8a93a8]">{item.source}</div>
                  </td>

                  <td className="py-3 pr-3 text-amber-300 font-mono">
                    {item.reserveAfter.toFixed(4)} SOL
                  </td>

                  <td className="py-3 pr-3 text-[#8a93a8] whitespace-nowrap">
                    {timeStr}
                  </td>

                  <td className="py-3 text-right">
                    {item.txSignature ? (
                      <a
                        href={`https://solscan.io/tx/${item.txSignature}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#10b981] hover:underline"
                      >
                        <span>{item.txSignature.slice(0, 4)}...{item.txSignature.slice(-4)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#5b6377] text-[10px]">internal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
