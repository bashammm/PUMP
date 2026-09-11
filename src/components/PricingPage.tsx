import React, { useState } from 'react';
import { CreditCard, Check, Flame, Zap, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { TokenLiveState } from '../types';

interface PricingPageProps {
  tokenState: TokenLiveState | null;
  onPaymentSuccess: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  tokenState,
  onPaymentSuccess,
}) => {
  const [selectedTier, setSelectedTier] = useState<'Starter' | 'Builder' | 'Scale'>('Builder');
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    tier: string;
    amountUsd: number;
    buybackSol: number;
    txSignature: string;
  } | null>(null);

  const solPrice = tokenState ? tokenState.solPriceUsd : 148.5;

  const tiers = [
    {
      name: 'Starter',
      priceUsd: 250,
      description: 'Ideal for prototyping automated token terminals & bots',
      buybackSol: (250 * 0.15) / solPrice,
      features: [
        '1 Autonomous Foundry App Generation',
        'Base44 Spot Deployment script',
        'Basic unMineable stratum connection',
        '15% ($37.50) converted to $BASH buybacks',
      ],
    },
    {
      name: 'Builder',
      priceUsd: 750,
      popular: true,
      description: 'Full product stack with dedicated Base44 mining fleet setup',
      buybackSol: (750 * 0.15) / solPrice,
      features: [
        '3 Autonomous Foundry App Deployments',
        'Orchestrated 4x C2 Spot VMs mining fleet',
        'Automated Capacity Governor & delay queue',
        'Gemini AI Strategy Advisor integration',
        '15% ($112.50) converted to $BASH buybacks',
      ],
    },
    {
      name: 'Scale',
      priceUsd: 2500,
      description: 'Enterprise product foundry with NVIDIA GPU mining integration',
      buybackSol: (2500 * 0.15) / solPrice,
      features: [
        'Unlimited Autonomous Foundry Pipeline runs',
        'Dedicated G2 L4 GPU accelerator node',
        'Custom pump.fun raydium graduation scripts',
        '24/7 autonomous monitoring daemon',
        '15% ($375.00) converted to $BASH buybacks',
      ],
    },
  ];

  const handleCheckout = async (tierName: 'Starter' | 'Builder' | 'Scale', amountUsd: number) => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tierName,
          amountUsd,
          method: 'SOL',
          clientName: 'Institutional Foundry Partner',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setSuccessModal({
          tier: tierName,
          amountUsd,
          buybackSol: data.payment.buybackSol,
          txSignature: data.payment.txSignature,
        });
        onPaymentSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#34d399] text-xs font-mono mb-3">
          <Flame className="w-3.5 h-3.5" />
          15% OF ALL PURCHASES ROUTED TO $BASH BUYBACKS
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-['Unbounded'] tracking-tight mb-2">
          Autonomous Foundry Tiers
        </h1>
        <p className="text-xs sm:text-sm text-[#8a93a8] font-mono">
          Purchase full-stack software generation, cloud hosting, and continuous token flywheel integration.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isSelected = selectedTier === t.name;
          return (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                t.popular
                  ? 'bg-gradient-to-b from-[#141722] to-[#0f1118] border-[#10b981]/50 shadow-xl shadow-emerald-950/20'
                  : 'bg-[#0f1118] border-[#1f2433]'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#10b981] text-black font-mono font-bold text-[10px] tracking-wider uppercase">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-mono">{t.name}</h3>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    +{t.buybackSol.toFixed(3)} SOL Buyback
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-4 font-mono">
                  <span className="text-3xl font-bold text-white">${t.priceUsd}</span>
                  <span className="text-xs text-[#8a93a8]">USD</span>
                </div>

                <p className="text-xs text-[#8a93a8] mb-6 leading-relaxed">
                  {t.description}
                </p>

                <div className="space-y-2.5 mb-8 text-xs font-mono">
                  {t.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#e0e2ec]">
                      <Check className="w-4 h-4 shrink-0 text-[#10b981] mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCheckout(t.name as any, t.priceUsd)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  t.popular
                    ? 'bg-[#10b981] hover:bg-[#059669] text-black shadow-lg shadow-emerald-900/30'
                    : 'bg-[#141722] hover:bg-[#1f2433] text-white border border-[#1f2433]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Select Tier & Trigger Buyback
              </button>
            </div>
          );
        })}
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1118] border border-[#10b981]/50 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white font-['Unbounded']">
              Product Funded & Buyback Triggered!
            </h3>

            <p className="text-xs text-[#8a93a8] font-mono leading-relaxed">
              Tier <span className="text-white font-bold">{successModal.tier}</span> (${successModal.amountUsd}) was processed.
              15% was immediately converted and injected into the $BASH pump.fun bonding curve!
            </p>

            <div className="bg-[#141722] p-4 rounded-xl border border-[#1f2433] font-mono text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8a93a8]">SOL Injected:</span>
                <span className="text-emerald-400 font-bold">+{successModal.buybackSol.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a93a8]">Simulated TX:</span>
                <span className="text-blue-400 truncate">{successModal.txSignature.slice(0, 16)}...</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModal(null)}
              className="w-full py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-mono font-bold text-xs transition-all"
            >
              Continue to Flywheel Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
