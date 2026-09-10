import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';
import type { TokenSnapshot } from '../types';

interface InjectionChartProps {
  snapshots: TokenSnapshot[];
}

export const InjectionChart: React.FC<InjectionChartProps> = ({ snapshots }) => {
  const [metric, setMetric] = useState<'mcap' | 'injected' | 'hashrate'>('mcap');

  const formattedData = snapshots.map((s) => {
    const d = new Date(s.timestamp);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return {
      time: timeStr,
      mcap: s.marketCapUsd,
      injected: parseFloat(s.cumulativeInjectedSol.toFixed(3)),
      hashrate: parseFloat(s.hashrateKhs.toFixed(2)),
    };
  });

  return (
    <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-['Unbounded']">
              Cumulative Growth & Impact
            </h2>
          </div>
          <p className="text-xs text-[#8a93a8] mt-0.5">
            Real-time trajectory of market capitalization, cumulative SOL injected, and GCP hashrate
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-lg border border-[#1f2433] text-xs font-mono">
          <button
            onClick={() => setMetric('mcap')}
            className={`px-3 py-1 rounded transition-all ${
              metric === 'mcap'
                ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            Market Cap ($)
          </button>
          <button
            onClick={() => setMetric('injected')}
            className={`px-3 py-1 rounded transition-all ${
              metric === 'injected'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            Injected SOL
          </button>
          <button
            onClick={() => setMetric('hashrate')}
            className={`px-3 py-1 rounded transition-all ${
              metric === 'hashrate'
                ? 'bg-[#4285F4]/20 text-[#93c5fd] border border-[#4285F4]/40 font-semibold'
                : 'text-[#8a93a8] hover:text-white'
            }`}
          >
            GCP Hashrate
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMcap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f2433" vertical={false} />
            <XAxis dataKey="time" stroke="#5b6377" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#5b6377"
              fontSize={11}
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => {
                if (metric === 'mcap') return `$${(v / 1000).toFixed(0)}k`;
                if (metric === 'injected') return `${v} SOL`;
                return `${v} kH`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0d1017',
                borderColor: '#1f2433',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            />

            {metric === 'mcap' && (
              <Area
                type="monotone"
                dataKey="mcap"
                name="Market Cap (USD)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMcap)"
              />
            )}

            {metric === 'injected' && (
              <Area
                type="monotone"
                dataKey="injected"
                name="Cumulative Injected (SOL)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInjected)"
              />
            )}

            {metric === 'hashrate' && (
              <Area
                type="monotone"
                dataKey="hashrate"
                name="Fleet Hashrate (kH/s)"
                stroke="#4285F4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHashrate)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
