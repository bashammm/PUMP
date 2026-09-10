import React, { useState } from 'react';
import {
  DollarSign,
  Layers,
  Cloud,
  RefreshCw,
  Coins,
  ShieldAlert,
  Flame,
  Rocket,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { FlywheelState, TokenLiveState, GcpMiningFleetSummary } from '../types';

interface FlywheelFlowDiagramProps {
  flywheelState: FlywheelState | null;
  tokenState: TokenLiveState | null;
  fleetSummary: GcpMiningFleetSummary | null;
  onNodeClick?: (nodeId: string) => void;
}

interface NodeData {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const FlywheelFlowDiagram: React.FC<FlywheelFlowDiagramProps> = ({
  flywheelState,
  tokenState,
  fleetSummary,
  onNodeClick,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('gcp_mining');

  const nodes: NodeData[] = [
    {
      id: 'client_payments',
      step: 1,
      title: 'Client Payments',
      subtitle: '15% Buyback Earmark',
      value: `${flywheelState ? flywheelState.total_payment_sol.toFixed(3) : '2.150'} SOL`,
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description:
        'Every product subscription or agency tier purchase in the Autonomous Foundry routes 15% of gross revenue straight into the $BASH buyback reserve.',
    },
    {
      id: 'stage_taps',
      step: 2,
      title: 'Stage 1-8 Taps',
      subtitle: '0.25% MRR per milestone',
      value: `${flywheelState ? flywheelState.total_stage_tap_sol.toFixed(3) : '0.570'} SOL`,
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      description:
        'As software products pass code generation, test suites, and deployment gates in the 8-stage pipeline, fractional MRR buyback taps trigger on-chain.',
    },
    {
      id: 'gcp_mining',
      step: 3,
      title: 'GCP Mining Fleet',
      subtitle: 'Compute Engine Spot VMs',
      value: `${fleetSummary ? fleetSummary.totalRandomXKhs : '30.4'} kH/s`,
      icon: <Cloud className="w-5 h-5 text-[#4285F4]" />,
      color: 'text-[#4285F4]',
      bgColor: 'bg-[#4285F4]/10',
      borderColor: 'border-[#4285F4]/30',
      description:
        'Orchestrated Google Cloud Compute Engine Spot instances (C2, T2D, G2 GPUs) mine RandomX and kHeavyHash with 68% cost savings vs on-demand.',
    },
    {
      id: 'pool_conversion',
      step: 4,
      title: 'Revenue Conversion',
      subtitle: 'unMineable -> SOL',
      value: `${flywheelState ? flywheelState.total_mining_sol.toFixed(3) : '3.120'} SOL`,
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      description:
        'Stratum shares submitted to unMineable automatically liquidate mined XMR and KAS directly into native Solana (SOL) delivered to the treasury.',
    },
    {
      id: 'buyback_reserve',
      step: 5,
      title: 'Buyback Reserve',
      subtitle: 'Buffer & Capital Sink',
      value: `${flywheelState ? flywheelState.buyback_reserve_sol.toFixed(4) : '0.4280'} SOL`,
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description:
        'Aggregates all incoming capital streams. Holds SOL until the Capacity Governor approves window deployment to prevent slippage.',
    },
    {
      id: 'capacity_governor',
      step: 6,
      title: 'Capacity Governor',
      subtitle: '60-min / 0.25 SOL Cap',
      value: `${flywheelState ? flywheelState.current_window_injected_sol.toFixed(3) : '0.120'} / 0.250`,
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      description:
        'Anti-dump algorithm enforcing a 60-minute window cap. Excess capital is queued in delay storage, preventing front-running bots and sudden sellwalls.',
    },
    {
      id: 'bonding_curve_inj',
      step: 7,
      title: 'Bonding Curve Injections',
      subtitle: 'pump.fun Buy & Burn',
      value: `${flywheelState ? flywheelState.total_injected_sol.toFixed(3) : '5.840'} SOL`,
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      description:
        'Programmatic SOL swaps directly on pump.fun constant product curve (x * y = k). Tokens bought are permanently burned, lifting the price floor.',
    },
    {
      id: 'graduation_upstream',
      step: 8,
      title: 'Raydium Graduation',
      subtitle: '85 SOL Milestone',
      value: `${tokenState ? tokenState.bondingCurveProgressPct : '38.1'}% Progress`,
      icon: <Rocket className="w-5 h-5 text-fuchsia-400" />,
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-500/10',
      borderColor: 'border-fuchsia-500/30',
      description:
        'Upon reaching 85 SOL ($12,000+ liquidity), pump.fun auto-deposits liquidity into Raydium and burns LP tokens permanently for institutional grade DEX depth.',
    },
  ];

  const active = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <h2 className="text-base sm:text-lg font-bold text-white font-['Unbounded']">
              Autonomous Capital Flywheel
            </h2>
          </div>
          <p className="text-xs text-[#8a93a8] mt-0.5">
            Real-time multi-stream capital loop fueling the $BASH bonding curve on pump.fun
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8a93a8]">
          <span className="px-2 py-0.5 rounded bg-[#141722] border border-[#1f2433]">
            8 Engine Nodes Active
          </span>
        </div>
      </div>

      {/* 8 Nodes Grid with Flow Arrows */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => {
                setSelectedNode(node.id);
                if (onNodeClick) onNodeClick(node.id);
              }}
              className={`text-left p-3.5 rounded-lg border transition-all relative overflow-hidden group ${
                isSelected
                  ? `${node.bgColor} ${node.borderColor} shadow-lg ring-1 ring-[#10b981]/50`
                  : 'bg-[#141722] border-[#1f2433] hover:border-[#2a3245] hover:bg-[#181c2b]'
              }`}
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#8a93a8] border border-white/5">
                  Node #{node.step}
                </span>
                <div className={`p-1.5 rounded-md ${node.bgColor} border ${node.borderColor}`}>
                  {node.icon}
                </div>
              </div>

              <div className="font-bold text-xs sm:text-sm text-white mb-0.5 tracking-tight">
                {node.title}
              </div>
              <div className="text-[11px] text-[#8a93a8] mb-2 truncate">{node.subtitle}</div>

              <div className={`text-xs sm:text-sm font-mono font-semibold ${node.color}`}>
                {node.value}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      <div className="bg-[#141722] border border-[#1f2433] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${active.bgColor} border ${active.borderColor} shrink-0`}>
            {active.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-black/30 text-[#8a93a8]">
                NODE {active.step} OF 8
              </span>
              <h3 className="text-sm font-bold text-white">{active.title}</h3>
              <span className="text-xs text-[#8a93a8]">({active.subtitle})</span>
            </div>
            <p className="text-xs text-[#8a93a8] mt-1 leading-relaxed max-w-3xl">
              {active.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1f2433]">
          <div className="text-[11px] text-[#8a93a8] font-mono">Live Telemetry</div>
          <div className={`text-base font-bold font-mono ${active.color}`}>{active.value}</div>
        </div>
      </div>
    </div>
  );
};
