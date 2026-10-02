import React, { useState } from 'react';
import { X, Calculator, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const MortgageModal: React.FC<MortgageModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 2280000,
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [downpaymentPct, setDownpaymentPct] = useState(25);
  const [interestRate, setInterestRate] = useState(3.2);
  const [tenureYears, setTenureYears] = useState(25);
  const [buyerType, setBuyerType] = useState<'citizen_1st' | 'citizen_2nd' | 'pr_1st'>('citizen_1st');

  if (!isOpen) return null;

  // Mortgage calculations
  const downpayment = price * (downpaymentPct / 100);
  const minCash = price * 0.05; // 5% minimum cash in SG
  const cpfDownpayment = downpayment - minCash;
  const loanQuantum = price - downpayment;

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  const monthlyInstallment =
    monthlyRate > 0
      ? (loanQuantum * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanQuantum / totalMonths;

  // Buyer's Stamp Duty (BSD) Singapore Tiered rates
  const calculateBSD = (p: number) => {
    let bsd = 0;
    if (p > 3000000) {
      bsd += (p - 3000000) * 0.06;
      p = 3000000;
    }
    if (p > 1500000) {
      bsd += (p - 1500000) * 0.05;
      p = 1500000;
    }
    if (p > 1000000) {
      bsd += (p - 1000000) * 0.04;
      p = 1000000;
    }
    if (p > 360000) {
      bsd += (p - 360000) * 0.03;
      p = 360000;
    }
    if (p > 180000) {
      bsd += (p - 180000) * 0.02;
      p = 180000;
    }
    bsd += p * 0.01;
    return bsd;
  };

  const bsd = calculateBSD(price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-sky-800 font-bold">
            <Calculator className="w-5 h-5" />
            <h2 className="text-base font-extrabold text-slate-900">
              Singapore Mortgage &amp; Affordability Calculator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Property Purchase Price (SGD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  step="50000"
                  value={price}
                  onChange={(e) => setPrice(Math.max(100000, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Downpayment: {downpaymentPct}% (${(downpayment / 1000).toFixed(0)}k)
              </label>
              <input
                type="range"
                min="25"
                max="60"
                step="5"
                value={downpaymentPct}
                onChange={(e) => setDownpaymentPct(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>25% (MAS Max LTV 75%)</span>
                <span>60%</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mortgage Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="8.0"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Current SORA floating benchmark: 3.1% – 3.4%
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Loan Tenure: {tenureYears} Years
              </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10 Years</span>
                <span>30 Years (MAS Private Max)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl">
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">
              Estimated Monthly Installment
            </div>
            <div className="text-3xl font-black text-white tabular-nums">
              ${Math.round(monthlyInstallment).toLocaleString()}{' '}
              <span className="text-sm font-semibold text-slate-400">/ month</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Bank Loan</span>
                <span className="font-bold text-white tabular-nums">
                  ${(loanQuantum / 1000000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">5% Min Cash</span>
                <span className="font-bold text-white tabular-nums">
                  ${Math.round(minCash).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CPF OA / Cash</span>
                <span className="font-bold text-white tabular-nums">
                  ${Math.round(cpfDownpayment).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Est. BSD Stamp Duty</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  ${Math.round(bsd).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Regulatory TDSR Advice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>MAS Total Debt Servicing Ratio (TDSR) Check:</strong> Monthly debt payments
              (including this mortgage) cannot exceed <strong>55%</strong> of your gross monthly
              income. Required household income to comfortably service this loan:{' '}
              <strong>${Math.round(monthlyInstallment / 0.55).toLocaleString()}/month</strong>.
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
