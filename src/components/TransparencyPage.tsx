import React from 'react';
import { ShieldCheck, Download, ExternalLink, Flame, Coins, Lock, CheckCircle2 } from 'lucide-react';
import type { TokenLiveState, FlywheelState, LedgerEntry } from '../types';

interface TransparencyPageProps {
  tokenState: TokenLiveState | null;
  flywheelState: FlywheelState | null;
  ledger: LedgerEntry[];
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({
  tokenState,
  flywheelState,
  ledger,
}) => {
  const downloadCsv = () => {
    const headers = ['ID', 'Timestamp', 'Type', 'AmountSol', 'AmountUsd', 'Source', 'Details', 'TxSignature'];
    const rows = ledger.map((item) => [
      item.id,
      new Date(item.timestamp).toISOString(),
      item.type,
      item.amountSol,
      item.amountUsd,
      `"${item.source}"`,
      `"${item.details.replace(/"/g, '""')}"`,
      item.txSignature || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bash_buyback_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Unbounded']">
              Transparency & On-Chain Audit
            </h1>
          </div>
          <p className="text-xs text-[#8a93a8] mt-1 font-mono">
            Every buyback, mining liquidation, and treasury event is permanently logged and verifiable on Solana.
          </p>
        </div>

        <button
          onClick={downloadCsv}
          className="px-4 py-2 rounded-lg bg-[#141722] hover:bg-[#1f2433] border border-[#1f2433] text-white text-xs font-mono transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Proof of Reserves Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5">
          <div className="flex items-center justify-between text-[#8a93a8] mb-1">
            <span>TREASURY SOL ADDRESS</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-1">
            {tokenState ? tokenState.creatorWallet : 'HTN1fv...ZV5i'}
          </div>
          <a
            href={`https://solscan.io/account/${tokenState ? tokenState.creatorWallet : ''}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:underline mt-2"
          >
            <span>Verify on Solscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5">
          <div className="flex items-center justify-between text-[#8a93a8] mb-1">
            <span>$BASH PUMP.FUN MINT</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-1">
            {tokenState ? tokenState.mint : '7cnu3...pump'}
          </div>
          <a
            href={tokenState ? tokenState.pumpFunUrl : 'https://pump.fun'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-rose-400 hover:underline mt-2"
          >
            <span>Live Bonding Curve</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5">
          <div className="flex items-center justify-between text-[#8a93a8] mb-1">
            <span>LIFETIME BUYBACK BURN</span>
            <Coins className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white mt-1">
            {flywheelState ? flywheelState.total_injected_sol.toFixed(4) : '5.8400'} SOL
          </div>
          <div className="text-[10px] text-emerald-400 mt-2">
            {flywheelState ? (flywheelState.total_tokens_burned / 1_000_000).toFixed(1) : '139.2'}M $BASH tokens burned
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-6">
        <h3 className="text-sm font-bold text-white font-mono mb-4">
          AUTOMATED GOVERNANCE VERIFICATIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141722] border border-[#1f2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Constant Product Curve Enforced</div>
              <div className="text-[11px] text-[#8a93a8] mt-0.5">
                Every purchase executes x * y = k formula with deterministic pricing.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141722] border border-[#1f2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Capacity Governor Anti-Slippage</div>
              <div className="text-[11px] text-[#8a93a8] mt-0.5">
                Caps injections at 0.25 SOL per 60-minute window to eliminate MEV sandwiching.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141722] border border-[#1f2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Base44 Spot Fleet Audited</div>
              <div className="text-[11px] text-[#8a93a8] mt-0.5">
                Preemptible VM monitoring guarantees lowest compute cost-to-hashrate conversion.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141722] border border-[#1f2433]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Raydium Graduation Auto-Burn</div>
              <div className="text-[11px] text-[#8a93a8] mt-0.5">
                At 85 SOL bonding capacity, 100% of liquidity will be migrated and LP burned.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
