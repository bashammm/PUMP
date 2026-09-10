import React, { useState, useEffect } from 'react';
import { SiteNav } from './components/SiteNav';
import { TokenTicker } from './components/TokenTicker';
import { FlywheelFlowDiagram } from './components/FlywheelFlowDiagram';
import { BuybackExecutionPanel } from './components/BuybackExecutionPanel';
import { GraduationProgressBar } from './components/GraduationProgressBar';
import { InjectionChart } from './components/InjectionChart';
import { LedgerTable } from './components/LedgerTable';
import { GcpMiningHub } from './components/GcpMiningHub';
import { HomePage } from './components/HomePage';
import { PricingPage } from './components/PricingPage';
import { TransparencyPage } from './components/TransparencyPage';
import { PulsePage } from './components/PulsePage';
import { SyndicatePanel } from './components/SyndicatePanel';
import { ContractAuditTab } from './components/ContractAuditTab';
import type {
  TokenLiveState,
  FlywheelState,
  FlywheelConfig,
  LedgerEntry,
  TokenSnapshot,
  GcpMiningFleetSummary,
  SyndicateWallet,
  RebalanceCycleState,
} from './types';
import { Settings, Shield, RefreshCw } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'flywheel' | 'syndicate' | 'gcloud' | 'contract' | 'home' | 'transparency' | 'pricing' | 'pulse'
  >('flywheel');

  // Core state
  const [tokenState, setTokenState] = useState<TokenLiveState | null>(null);
  const [flywheelState, setFlywheelState] = useState<FlywheelState | null>(null);
  const [config, setConfig] = useState<FlywheelConfig | null>(null);
  const [fleetSummary, setFleetSummary] = useState<GcpMiningFleetSummary | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [snapshots, setSnapshots] = useState<TokenSnapshot[]>([]);
  const [syndicateWallets, setSyndicateWallets] = useState<SyndicateWallet[]>([]);
  const [rebalanceCycle, setRebalanceCycle] = useState<RebalanceCycleState | null>(null);

  // Director settings modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editCapSol, setEditCapSol] = useState(0.25);
  const [editAutoCycle, setEditAutoCycle] = useState(true);

  const fetchStatus = async () => {
    try {
      const [resStatus, resLedger, resHist, resSyndicate, resCycle] = await Promise.all([
        fetch('/api/flywheel/status'),
        fetch('/api/flywheel/ledger?limit=50'),
        fetch('/api/flywheel/history'),
        fetch('/api/syndicate/wallets'),
        fetch('/api/syndicate/cycle'),
      ]);

      if (resStatus.ok && resStatus.headers.get('content-type')?.includes('application/json')) {
        const dataStatus = await resStatus.json();
        if (dataStatus.token) setTokenState(dataStatus.token);
        if (dataStatus.state) setFlywheelState(dataStatus.state);
        if (dataStatus.config) {
          setConfig(dataStatus.config);
          setEditCapSol(dataStatus.config.governor_cap_sol);
          setEditAutoCycle(dataStatus.config.auto_cycle_enabled);
        }
        if (dataStatus.fleet) setFleetSummary(dataStatus.fleet);
      }

      if (resLedger.ok && resLedger.headers.get('content-type')?.includes('application/json')) {
        const dataLedger = await resLedger.json();
        if (Array.isArray(dataLedger)) setLedger(dataLedger);
      }

      if (resHist.ok && resHist.headers.get('content-type')?.includes('application/json')) {
        const dataHist = await resHist.json();
        if (Array.isArray(dataHist)) setSnapshots(dataHist);
      }

      if (resSyndicate.ok && resSyndicate.headers.get('content-type')?.includes('application/json')) {
        const dataSynd = await resSyndicate.json();
        if (Array.isArray(dataSynd.wallets)) setSyndicateWallets(dataSynd.wallets);
      }

      if (resCycle.ok && resCycle.headers.get('content-type')?.includes('application/json')) {
        const dataCycle = await resCycle.json();
        if (dataCycle.cycle) setRebalanceCycle(dataCycle.cycle);
      }
    } catch (err) {
      console.warn('Status poll warning (handled gracefully):', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = async () => {
    try {
      await fetch('/api/flywheel/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          governor_cap_sol: editCapSol,
          auto_cycle_enabled: editAutoCycle,
        }),
      });
      setShowConfigModal(false);
      fetchStatus();
    } catch (e) {
      console.warn('Config save notice:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f0f3f8] flex flex-col selection:bg-[#10b981]/30 selection:text-[#34d399]">
      {/* Top Header & Navigation */}
      <SiteNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tokenState={tokenState}
        fleetSummary={fleetSummary}
      />

      {/* Live Market & Telemetry Ticker Strip */}
      <TokenTicker
        tokenState={tokenState}
        flywheelState={flywheelState}
        fleetSummary={fleetSummary}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'flywheel' && (
          <div className="space-y-6">
            {/* Top Row: 8-Node Diagram */}
            <FlywheelFlowDiagram
              flywheelState={flywheelState}
              tokenState={tokenState}
              fleetSummary={fleetSummary}
            />

            {/* Middle Row: Execution Panel & Graduation Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BuybackExecutionPanel
                flywheelState={flywheelState}
                tokenState={tokenState}
                config={config}
                onRefresh={fetchStatus}
              />
              <GraduationProgressBar
                tokenState={tokenState}
                flywheelState={flywheelState}
              />
            </div>

            {/* Growth & Impact Chart */}
            <InjectionChart snapshots={snapshots} />

            {/* Live Ledger Table */}
            <LedgerTable ledger={ledger} />
          </div>
        )}

        {activeTab === 'syndicate' && (
          <SyndicatePanel
            wallets={syndicateWallets}
            rebalanceCycle={rebalanceCycle}
            tokenState={tokenState}
            fleetSummary={fleetSummary}
            onRefresh={fetchStatus}
          />
        )}

        {activeTab === 'gcloud' && (
          <GcpMiningHub
            fleetSummary={fleetSummary}
            onRefresh={fetchStatus}
          />
        )}

        {activeTab === 'contract' && (
          <ContractAuditTab />
        )}

        {activeTab === 'home' && (
          <HomePage
            tokenState={tokenState}
            fleetSummary={fleetSummary}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingPage
            tokenState={tokenState}
            onPaymentSuccess={fetchStatus}
          />
        )}

        {activeTab === 'transparency' && (
          <TransparencyPage
            tokenState={tokenState}
            flywheelState={flywheelState}
            ledger={ledger}
          />
        )}

        {activeTab === 'pulse' && (
          <PulsePage
            onTriggerStageTap={() => {
              fetch('/api/cycle/run', { method: 'POST' }).then(() => fetchStatus());
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f2433] bg-[#0b0c10] py-6 px-4 text-center text-xs font-mono text-[#8a93a8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-white font-bold">$BASH</span>
            <span>· Autonomous Product Foundry & GCP Mining Flywheel</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowConfigModal(true)}
              className="hover:text-white flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Director Settings
            </button>
            <span>·</span>
            <a
              href="https://pump.fun/coin/7cnu3w5SbTxCrYTPavBJ7dib4Bdnf6mN5AG98xzDpump"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400"
            >
              pump.fun
            </a>
            <span>·</span>
            <a
              href="https://solscan.io/token/7cnu3w5SbTxCrYTPavBJ7dib4Bdnf6mN5AG98xzDpump"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400"
            >
              Solscan
            </a>
          </div>
        </div>
      </footer>

      {/* Director Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-[#1f2433] rounded-xl max-w-md w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                Director Flywheel Configuration
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#8a93a8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#8a93a8] mb-1">
                  Governor 60-Minute Window Cap (SOL)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={editCapSol}
                  onChange={(e) => setEditCapSol(parseFloat(e.target.value))}
                  className="w-full bg-[#141722] border border-[#1f2433] rounded-lg p-2 text-white"
                />
                <div className="text-[10px] text-[#5b6377] mt-0.5">
                  Prevents front-running; excess is queued in delay ledger.
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#141722] border border-[#1f2433]">
                <div>
                  <div className="text-white font-semibold">Autonomous Auto-Cycle</div>
                  <div className="text-[10px] text-[#5b6377]">
                    Automatically injects reserve when conditions permit
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editAutoCycle}
                  onChange={(e) => setEditAutoCycle(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-[#07080b] border-[#1f2433]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1f2433]">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 rounded-lg text-[#8a93a8] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-bold"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
