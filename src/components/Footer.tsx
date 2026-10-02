import React from 'react';

interface FooterProps {
  onOpenGeodesicInfo: () => void;
  onOpenBallotingArchive: () => void;
  onOpenTerms: () => void;
  onOpenApiStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenGeodesicInfo,
  onOpenBallotingArchive,
  onOpenTerms,
  onOpenApiStatus,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-10 py-6 text-xs text-slate-500">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800">EduHomes SG</span>
          <span className="text-slate-300">•</span>
          <span>
            Real estate analytics verified with MOE P1 Registration Framework and Singapore Land
            Authority geo-boundaries.
          </span>
        </div>
        <div className="flex items-center gap-6 text-slate-600 flex-wrap">
          <button
            onClick={onOpenGeodesicInfo}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            1km Calculation Methodology
          </button>
          <button
            onClick={onOpenBallotingArchive}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            Balloting History Archive
          </button>
          <button
            onClick={onOpenTerms}
            className="hover:text-slate-900 transition cursor-pointer"
          >
            Terms of Intelligence
          </button>
          <button
            onClick={onOpenApiStatus}
            className="font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer"
          >
            OneMap &amp; HDB APIs (/api)
          </button>
        </div>
      </div>
    </footer>
  );
};
