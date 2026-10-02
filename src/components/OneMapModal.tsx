import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface OneMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneMapModal: React.FC<OneMapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              OneMap Geodesic Verification &amp; 2022 MOE Framework
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <span className="font-bold text-emerald-900 block mb-1 text-sm">
              Official MOE School Land Boundary (SLB) Method
            </span>
            <p className="text-emerald-800 text-xs">
              Since the 2022 Primary 1 Registration Exercise, the Ministry of Education (MOE) and
              Singapore Land Authority (SLA) compute home-school distance from any point on the{' '}
              <strong>school perimeter boundary</strong> to the applicant's residential block
              boundary, rather than a single center point.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Key Implications for Home Buyers:
            </h3>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Expanded 1km Coverage:</strong> On average, this revision expanded the 1km
                radius zone by roughly 10% to 15%, bringing thousands more residential units into
                Priority 1.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Zero Discrepancies with OneMap:</strong> All coordinates in EduHomes SG are
                synced with OneMap SLA Geodesic APIs to ensure zero risk of misjudging priority eligibility.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>30-Month Minimum Stay Rule:</strong> Under MOE rules, a child registered using
                the address within 1km or 1-2km must reside at that address for at least 30 months from the start of the P1 exercise.
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
