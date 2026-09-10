export interface TokenLiveState {
  symbol: string;
  name: string;
  mint: string;
  creatorWallet: string;
  priceSol: number;
  priceUsd: number;
  solPriceUsd: number;
  marketCapUsd: number;
  virtualSolReserves: number;
  virtualTokenReserves: number;
  bondingCurveProgressPct: number;
  graduationTargetSol: number;
  volume24hUsd: number;
  change24hPct: number;
  holdersCount: number;
  pumpFunUrl: string;
}

export interface FlywheelConfig {
  buyback_pct: number;
  stage_tap_pct: number;
  mrr_usd: number;
  mining_share_pct: number;
  governor_window_minutes: number;
  governor_cap_sol: number;
  min_injection_sol: number;
  graduation_target_sol: number;
  auto_cycle_enabled: boolean;
  auto_cycle_interval_sec: number;
  gcp_telemetry_enabled: boolean;
}

export interface FlywheelState {
  buyback_reserve_sol: number;
  total_injected_sol: number;
  total_injected_usd: number;
  total_tokens_burned: number;
  injections_count: number;
  current_window_injected_sol: number;
  window_start_time: number;
  window_rolls_count: number;
  delayed_injections_count: number;
  total_mining_sol: number;
  total_payment_sol: number;
  total_stage_tap_sol: number;
  last_injection_time?: number;
  last_injection_sol?: number;
}

export interface SyndicateWallet {
  id: string;
  label: string;
  address: string;
  solBalance: number;
  tokenBalance: number;
  role: 'PUMP_INJECTOR' | 'PROFIT_HARVESTER' | 'DIP_REBUYER' | 'TREASURY_PROXY';
  totalPumps: number;
  totalSolDeployed: number;
  status: 'IDLE' | 'PUMPING' | 'HARVESTING' | 'REBUYING';
  lastTxSignature: string;
}

export type CyclePhase = 'VOLUME_PUMP' | 'HARVEST_50_MAIN' | 'DIP_CREATED' | 'DIP_REBUY_35' | 'COMPOUND_IDLE';

export interface RebalanceCycleState {
  currentPhase: CyclePhase;
  cycleIteration: number;
  totalProfitWithdrawnSol: number; // 50% sold to main wallet
  totalReinvestedSol: number; // 35% sold + mining SOL pumped back
  lastHarvestSol: number;
  lastRebuySol: number;
  autoRebalanceEnabled: boolean;
  targetPumpVolumeSol: number;
  mainWalletAddress: string;
  phaseProgressPct: number;
  lastActionTimestamp: number;
}

export interface AuditContractSpec {
  programId: string;
  network: string;
  auditStatus: string;
  auditor: string;
  anchorCode: string;
  verifiedTimestamp: string;
  features: string[];
}

export interface LedgerEntry {
  id: string;
  timestamp: number;
  type: 'injection' | 'allocation' | 'delay' | 'window_roll' | 'stage_tap' | 'gcp_mining' | 'syndicate_pump' | 'harvest_50' | 'rebuy_35';
  amountSol: number;
  amountUsd: number;
  source: string;
  details: string;
  txSignature?: string;
  reserveAfter: number;
}

export interface TokenSnapshot {
  timestamp: number;
  priceUsd: number;
  marketCapUsd: number;
  cumulativeInjectedSol: number;
  reserveSol: number;
  hashrateKhs: number;
}

// Google Cloud Mining Fleet Types
export type GceMachineFamily = 'C2-Compute' | 'C3-NextGen' | 'T2D-AMDEpyc' | 'N2-General' | 'G2-NvidiaL4' | 'A2-NvidiaA100' | 'C3-SapphireRapids';
export type InstanceStatus = 'RUNNING' | 'PROVISIONING' | 'STOPPED' | 'PREEMPTED';
export type MiningAlgo = 'randomx' | 'kheavyhash' | 'autolykos2' | 'etchash' | 'fishhash' | 'pearl';

export interface GceMiningInstance {
  id: string;
  name: string;
  zone: string;
  machineType: string;
  family: GceMachineFamily;
  vCPUs: number;
  memoryGb: number;
  hasGpu: boolean;
  gpuType?: string;
  isSpot: boolean;
  algo: MiningAlgo;
  status: InstanceStatus;
  hashrate: number; // in unit (kH/s for RandomX, MH/s for GPU)
  hashrateUnit: string;
  cpuUsagePct: number;
  tempCelsius: number;
  costPerHourUsd: number;
  dailyYieldCoins: number;
  dailyYieldSol: number;
  dailyYieldUsd: number;
  netMarginPct: number;
  uptimeSeconds: number;
  lastPing: number;
  pool: string;
  command?: string;
  workerId?: string;
  // Live unMineable Stratum Hookup Telemetry
  unmineableHookedUp?: boolean;
  stratumStatus?: 'CONNECTED' | 'AUTHENTICATING' | 'DISCONNECTED' | 'OFFLINE' | 'ERROR';
  stratumJobId?: string;
  stratumPingMs?: number;
  stratumSharesAccepted?: number;
  stratumLastActive?: number;
}

export interface GcpMiningFleetSummary {
  totalInstances: number;
  runningInstances: number;
  totalRandomXKhs: number;
  totalkHeavyHashMhs: number;
  totalFishHashMhs?: number;
  totalPearlMhs?: number;
  totalPowerWatts: number;
  totalCostPerHourUsd: number;
  totalDailyYieldSol: number;
  totalDailyYieldUsd: number;
  netProfitDailyUsd: number;
  avgNetMarginPct: number;
  spotSavingsPct: number;
  projectId: string;
  defaultZone: string;
  solRecipient: string;
}

export interface GeminiMiningAnalysis {
  recommendation: string;
  optimalMachineType: string;
  optimalAlgo: MiningAlgo;
  expectedDailyRoiPct: number;
  spotRiskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  governorTimingAdvice: string;
  tokenPumpImpactEstimate: string;
}

export interface WhatToMineAlgoRow {
  algo: MiningAlgo;
  label: string;
  hw: string;
  coin: string;
  unit: string;
  hashrate: number;
  coinsDay: number;
  usdDay: number;
  solDay: number;
  solMonth: number;
  perUnitUsdDay: number;
  pool: string;
  miner: string;
  command: string;
}

export interface WhatToMineEstimate {
  btcUsd: number;
  solUsd: number;
  poolFeePct: number;
  rows: WhatToMineAlgoRow[];
}

export interface UnmineableWorker {
  algo: string;
  name: string;
  online: boolean;
  reportedHs: number;
  calculatedHs: number;
  lastSeen: number;
}

export interface UnmineableLiveChartPoint {
  timestamp: number;
  hashrateHs: number;
}

export interface UnmineableWorkerDetail {
  name: string;
  algo: string;
  online: boolean;
  reportedHs: number;
  calculatedHs: number;
  lastSeen: number;
  uuid?: string;
  pool?: string;
}

export interface UnmineableLiveStats {
  address: string;
  coin: string;
  network: string;
  balanceSol: number;
  balanceUsd: number;
  paymentThresholdSol: number;
  thresholdProgressPct: number;
  online: boolean;
  workerName: string;
  reportedHashrateHs: number;
  calculatedHashrateHs: number;
  rawCommand: string;
  pool: string;
  algo: string;
  chart: UnmineableLiveChartPoint[];
  lastUpdated: number;
  allWorkers?: UnmineableWorkerDetail[];
  stratumBridge?: {
    connectedWorkers: number;
    totalWorkers: number;
    activePool: string;
    lastPingMs: number;
    totalSharesAccepted: number;
    status: 'ACTIVE' | 'CONNECTING' | 'IDLE';
  };
}

export interface UnmineableStatus {
  pool: string;
  payoutCoin: string;
  address: string;
  ok: boolean;
  pendingSol: number;
  pendingUsd: number;
  paymentThresholdSol: number;
  thresholdPct: number;
  poolFeePct: number;
  workers: UnmineableWorker[];
  workersOnline: number;
  payoutsTotalSol: number;
  allocatedTotalSol: number;
  sharePct: number;
}

export interface PaymentItem {
  id: string;
  tier: 'Starter' | 'Builder' | 'Scale';
  amountUsd: number;
  method: 'SOL' | 'CARD' | 'USDC';
  clientName: string;
  timestamp: number;
  buybackEarmarkedSol: number;
  txHash: string;
}

export interface CycleStageEvent {
  stageNumber: number;
  stageName: string;
  action: string;
  tapAmountSol: number;
  status: 'PENDING' | 'EXECUTED' | 'WAITING_GATE';
}
