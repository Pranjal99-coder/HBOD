import React from 'react';
import { Stethoscope, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'landing' | 'workbench' | 'analytics';
  onSelectTab: (tab: 'landing' | 'workbench' | 'analytics') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onNavigateSection
}) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (activeTab !== 'landing') {
      onSelectTab('landing');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E7E5DF] transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('landing')}
          className="text-xl font-bold tracking-tight text-[#112220] hover:text-[#2D6A5F] transition-colors whitespace-nowrap shrink-0 font-serif flex items-center gap-2.5 text-left cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#2D6A5F] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Stethoscope className="w-4 h-4 text-[#F4F9F8]" />
          </span>
          <span>Prognosis Flow</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4C5B58]">
          <button
            onClick={() => onSelectTab('workbench')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#112220] cursor-pointer ${
              activeTab === 'workbench' ? 'text-[#2D6A5F] font-semibold underline underline-offset-8' : ''
            }`}
          >
            Clinical Workbench
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#112220] cursor-pointer ${
              activeTab === 'analytics' ? 'text-[#2D6A5F] font-semibold underline underline-offset-8' : ''
            }`}
          >
            Cohort Analytics & KPIs
          </button>
          <a
            href="#models"
            onClick={(e) => handleNavClick(e, 'models')}
            className="hover:text-[#112220] transition-colors whitespace-nowrap shrink-0"
          >
            Predictive Models
          </a>
          <a
            href="#cohorts"
            onClick={(e) => handleNavClick(e, 'cohorts')}
            className="hover:text-[#112220] transition-colors whitespace-nowrap shrink-0"
          >
            Patient Case Studies
          </a>
          <a
            href="#validation"
            onClick={(e) => handleNavClick(e, 'validation')}
            className="hover:text-[#112220] transition-colors whitespace-nowrap shrink-0"
          >
            Clinical Validation
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab(activeTab === 'workbench' ? 'landing' : 'workbench')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#182F2C] hover:bg-[#254440] active:scale-[0.99] rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>{activeTab === 'workbench' ? 'View Platform Overview' : 'Open Clinical Workbench'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
