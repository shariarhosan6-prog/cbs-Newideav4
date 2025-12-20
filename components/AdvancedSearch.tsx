
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Check, Save, Zap, Clock, ShieldAlert, Users, LayoutGrid } from 'lucide-react';
import { SearchFilters, ApplicationStage } from '../types';

interface Props {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const STAGES: ApplicationStage[] = [
  'lead', 'gs_assessment', 'financial_audit', 'sop_drafting', 
  'rto_submission', 'conditional_offer', 'payment_confirmed', 
  'coe_issued', 'visa_lodged', 'biometrics_booked', 
  'medical_completed', 'visa_granted', 'onshore_arrival', 
  'b2b_settlement', 'certified'
];

const AdvancedSearch: React.FC<Props> = ({ filters, onFilterChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleStage = (stage: ApplicationStage) => {
    const newStages = filters.stages.includes(stage)
      ? filters.stages.filter(s => s !== stage)
      : [...filters.stages, stage];
    onFilterChange({ ...filters, stages: newStages });
  };

  const togglePriority = (priority: 'high' | 'medium' | 'low') => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    onFilterChange({ ...filters, priorities: newPriorities });
  };

  const hasActiveFilters = filters.query || filters.stages.length > 0 || filters.priorities.length > 0 || filters.sources.length > 0;

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-[40]">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search across students, sub-agents, or documents..."
              value={filters.query}
              onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all"
            />
            {filters.query && (
              <button onClick={() => onFilterChange({ ...filters, query: '' })} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isExpanded || hasActiveFilters ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
          </button>
        </div>

        {/* EXPANDABLE FILTER PANEL */}
        {isExpanded && (
          <div className="mt-6 p-8 bg-slate-50 rounded-[32px] border border-slate-200 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* STAGES COLUMN */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="w-3.5 h-3.5" /> Filter by Stage
                </h4>
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {STAGES.map(stage => (
                    <button 
                      key={stage}
                      onClick={() => toggleStage(stage)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-2 border ${filters.stages.includes(stage) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}
                    >
                      {filters.stages.includes(stage) && <Check className="w-3 h-3" />}
                      {stage.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRIORITY & SOURCE COLUMN */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5" /> Lead Priority
                  </h4>
                  <div className="flex gap-2">
                    {(['high', 'medium', 'low'] as const).map(p => (
                      <button 
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${filters.priorities.includes(p) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Source Channel
                  </h4>
                  <div className="flex gap-2">
                    {(['direct', 'sub_agent'] as const).map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          const newSources = filters.sources.includes(s) ? filters.sources.filter(x => x !== s) : [...filters.sources, s];
                          onFilterChange({ ...filters, sources: newSources });
                        }}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${filters.sources.includes(s) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'}`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRESETS COLUMN */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-500" /> Intelligence Presets
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Today's Follow-ups", icon: Clock, filter: { stages: ['lead', 'gs_assessment'], priorities: ['high'] } },
                    { label: "Overdue Payments", icon: ShieldAlert, filter: { stages: ['conditional_offer', 'payment_confirmed'] } },
                    { label: "Direct High-Value", icon: Zap, filter: { sources: ['direct'], priorities: ['high'] } }
                  ].map((preset, i) => (
                    <button 
                      key={i}
                      onClick={() => onFilterChange({ ...filters, ...preset.filter } as any)}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <preset.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        <span className="text-xs font-bold text-slate-700">{preset.label}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90" />
                    </button>
                  ))}
                  <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-2xl transition-all">
                    <Save className="w-3.5 h-3.5" /> Save Current View
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={onClear} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Clear All Filters</button>
              <button onClick={() => setIsExpanded(false)} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Apply Search Intelligence</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
