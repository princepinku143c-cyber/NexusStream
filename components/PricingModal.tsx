
import React, { useState } from 'react';
import { Check, X, Zap, Crown, Building2, Sparkles, Globe, Percent, ArrowRight } from 'lucide-react';
import { Region } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BillingCycle = 'monthly' | 'yearly';

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [region, setRegion] = useState<Region>('IN');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly'); // Default to yearly for better AOV

  if (!isOpen) return null;

  const plans = [
    {
      name: "Free Core",
      price: region === 'IN' ? "₹0" : "$0",
      description: "For testing & hobbyists.",
      icon: Zap,
      features: ["5 Workflows", "2 AI Agents", "Community Connectors", "Own API Keys", "Last 24h Logs"],
      buttonText: "Current Plan",
      buttonClass: "bg-nexus-800 text-gray-500 border border-nexus-700 cursor-not-allowed",
      savings: null,
      badge: null
    },
    {
      name: "Nexus Starter",
      monthlyPrice: region === 'IN' ? "₹799" : "$14",
      yearlyPrice: region === 'IN' ? "₹7,999" : "$139",
      savings: region === 'IN' ? "Save ₹1,589" : "Save $29",
      badge: "2 Months Free",
      description: "Perfect for SMB automation.",
      icon: Sparkles,
      recommended: true,
      features: ["10 Workflows", "3 AI Agents", "5,000 Executions", "Telegram & Discord", "30 Days History"],
      buttonText: "Get Started",
      buttonClass: "bg-nexus-accent text-black font-bold shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:scale-105 active:scale-95"
    },
    {
      name: "Nexus Pro",
      monthlyPrice: region === 'IN' ? "₹1,999" : "$29",
      yearlyPrice: region === 'IN' ? "₹18,999" : "$249",
      savings: region === 'IN' ? "Save ~₹5,000" : "Save $99",
      badge: "Best Value",
      description: "For high-scale operations.",
      icon: Crown,
      features: ["50 Workflows", "10 AI Agents", "25,000 Executions", "Premium Connectors (Notion, Airtable)", "Priority Failure Alerts"],
      buttonText: "Upgrade to Pro",
      buttonClass: "bg-gradient-to-r from-nexus-accent to-blue-500 text-black font-bold hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(59,130,246,0.3)]"
    }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#080808] border border-nexus-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Superior Header */}
        <div className="p-8 border-b border-nexus-800/50 flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a] gap-6">
           <div className="text-center md:text-left">
              <h2 className="text-3xl font-display font-bold text-white flex items-center justify-center md:justify-start gap-3">
                 <div className="p-2 bg-nexus-accent/10 rounded-xl border border-nexus-accent/20">
                    <Crown className="text-nexus-accent" size={24} />
                 </div>
                 Elevate Your Stream
              </h2>
              <p className="text-sm text-gray-500 mt-2 font-mono uppercase tracking-[0.2em]">Unlock next-gen agents & premium synapses</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Billing Cycle Selector */}
              <div className="flex items-center gap-1 bg-nexus-800/50 p-1 rounded-2xl border border-nexus-700/50 relative">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-xl text-[11px] font-bold transition-all relative z-10 ${billingCycle === 'monthly' ? 'bg-nexus-700 text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-xl text-[11px] font-bold transition-all relative z-10 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-nexus-accent text-black shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Annual <span className="bg-black/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-tight">2 MONTHS FREE</span>
                  </button>
              </div>

              {/* Region Selector */}
              <div className="flex bg-nexus-800/30 rounded-xl p-1 border border-nexus-700/30">
                  <button 
                    onClick={() => setRegion('IN')} 
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${region === 'IN' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                      IND (₹)
                  </button>
                  <button 
                    onClick={() => setRegion('GLOBAL')} 
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${region === 'GLOBAL' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                      GLO ($)
                  </button>
              </div>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
           </div>
        </div>

        {/* Dynamic Plans Display */}
        <div className="p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8 bg-black">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col group ${
                plan.recommended 
                  ? 'bg-nexus-900/40 border-nexus-accent shadow-[0_0_40px_rgba(0,255,157,0.05)] scale-105 z-10' 
                  : plan.name === "Nexus Pro" 
                    ? 'bg-nexus-900/40 border-blue-500/50 hover:border-blue-500' 
                    : 'bg-[#050505] border-nexus-800'
              }`}
            >
              {/* Badge System */}
              {billingCycle === 'yearly' && plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                    plan.name === "Nexus Pro" ? 'bg-blue-600 text-white' : 'bg-nexus-accent text-black'
                }`}>
                    {plan.badge}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                 <div className={`p-3 rounded-2xl ${plan.recommended ? 'bg-nexus-accent/10 text-nexus-accent' : 'bg-nexus-800 text-gray-400'}`}>
                    <plan.icon size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-display font-bold text-white">{plan.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{plan.description}</p>
                 </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-white tracking-tighter">
                        {billingCycle === 'monthly' ? (plan.monthlyPrice || plan.price) : (plan.yearlyPrice || plan.price)}
                    </span>
                    <span className="text-gray-500 text-xs font-mono font-bold uppercase">
                        {billingCycle === 'monthly' ? '/ MONTH' : '/ YEAR'}
                    </span>
                </div>
                {billingCycle === 'yearly' && plan.savings && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-accent/10 rounded-lg text-[11px] text-nexus-accent font-black mt-3 animate-pulse uppercase tracking-wider">
                        <Percent size={12} /> {plan.savings}
                    </div>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3 group/feat">
                    <div className="mt-1 p-0.5 rounded-full bg-nexus-accent/20 group-hover/feat:bg-nexus-accent transition-colors">
                        <Check size={12} className="text-nexus-accent group-hover/feat:text-black transition-colors" />
                    </div>
                    <span className="text-xs text-gray-400 group-hover/feat:text-gray-200 transition-colors font-medium">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                   const paymentType = region === 'IN' ? 'Razorpay (UPI/Auto-pay)' : 'Stripe (Card/Checkout)';
                   alert(`Redirecting to ${paymentType} for ${plan.name} ${billingCycle} plan...`);
                }}
                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${plan.buttonClass}`}
              >
                {plan.buttonText} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Global Security Footer */}
        <div className="p-8 border-t border-nexus-800/50 bg-[#0a0a0a] flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 text-[11px] text-gray-500 font-mono font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 group cursor-help">
                    <Globe size={14} className="text-nexus-wire group-hover:rotate-45 transition-transform"/> Region: {region === 'IN' ? 'BHARAT' : 'WORLDWIDE'}
                </div>
                <div className="flex items-center gap-2">
                    <Check size={14} className="text-nexus-accent"/> Secure SSL
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-600 font-bold uppercase">Need a custom plan?</span>
                <button className="px-6 py-2.5 bg-nexus-800 hover:bg-white hover:text-black text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-nexus-700/50">
                    Contact Enterprise
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
