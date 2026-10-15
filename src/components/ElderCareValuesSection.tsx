import React from 'react';
import { Heart, Clock, Users, Shield, Award, Stethoscope } from 'lucide-react';

export const ElderCareValuesSection: React.FC = () => {
  return (
    <section id="care-philosophy" className="py-20 lg:py-28 bg-[#F5F4EE] border-b border-[#E3E1D7]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#2D6A5F] mb-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
            <span>Human-Centered Terminal Care</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A5F]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#142624] tracking-tight">
            Transforming terminal prognosis from uncertainty into compassionate care.
          </h2>
          <p className="mt-4 text-[#4C5E5A] text-base leading-relaxed">
            Machine learning accuracy is only meaningful when it serves human dignity. Prognosis Flow provides healthcare professionals with early, calibrated foresight so that patient comfort, palliative support, and family goals are prioritized well before crisis events.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-[#DFDDD4] shadow-xs hover:border-[#CFCCC2] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F] mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#152725] mb-2">
                Timely Palliative Integration
              </h3>
              <p className="text-xs text-[#526461] leading-relaxed">
                By identifying terminal disease trajectories months in advance, clinicians introduce palliative care alongside disease-directed therapies rather than in the final days of life.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F] font-semibold">
              4.8 Months Earlier Palliative Consult
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#DFDDD4] shadow-xs hover:border-[#CFCCC2] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F] mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#152725] mb-2">
                Dignity & Comfort First
              </h3>
              <p className="text-xs text-[#526461] leading-relaxed">
                Automated alerts highlight contraindicated medications and propose personalized protocols for pain relief, dyspnea reduction, and nausea control.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F] font-semibold">
              64% Reduction in Avoidable ICU Visits
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#DFDDD4] shadow-xs hover:border-[#CFCCC2] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#152725] mb-2">
                Multidisciplinary Consensus
              </h3>
              <p className="text-xs text-[#526461] leading-relaxed">
                Unifies surgical oncology, neurology, geriatric nursing, and social work around calibrated survival curves and explicit goal-of-care frameworks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F] font-semibold">
              EHR & Epic/Cerner Compatible Notes
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#DFDDD4] shadow-xs hover:border-[#CFCCC2] transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF2EE] flex items-center justify-center text-[#2D6A5F] mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#152725] mb-2">
                Explainable Decision Support
              </h3>
              <p className="text-xs text-[#526461] leading-relaxed">
                Zero black-box predictions. Every forecast is substantiated with SHAP feature weightings, confidence bands, and reference guidelines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE5] text-[11px] font-mono text-[#2D6A5F] font-semibold">
              100% Auditable Bayesian Weights
            </div>
          </div>

        </div>

        {/* Quote / Editorial Callout */}
        <div className="mt-14 p-8 bg-white rounded-2xl border border-[#DFDDD4] shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#182C29] text-white flex items-center justify-center shrink-0 font-serif text-xl font-bold">
              EV
            </div>
            <div>
              <p className="text-base sm:text-lg font-serif italic text-[#1C2F2C] leading-relaxed">
                &ldquo;Predictive machine learning in terminal illness is not about predicting the end; it is about protecting the time that remains. Prognosis Flow gives our clinical team the certainty needed to recommend comfort-first pathways before irreversible decline occurs.&rdquo;
              </p>
              <div className="mt-3 text-xs text-[#576A66]">
                <strong className="text-[#152725]">Dr. Eleanor Vance, MD</strong> · Chief of Palliative Oncology, St. Jude University Health System
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
