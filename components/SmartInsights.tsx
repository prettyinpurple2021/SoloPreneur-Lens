
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { BusinessInsight } from '../types';
import { ShieldCheck, AlertTriangle, Zap, TrendingUp, Shuffle, ArrowRight } from 'lucide-react';

interface SmartInsightsProps {
  insights: BusinessInsight;
  onPivot: (pivot: string) => void;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ 
  insights, 
  onPivot
}) => {
  if (!insights || !insights.swot) return null;

  const { swot, pivots } = insights;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 print:w-full">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SWOT Analysis Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm print:border-black">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> AI Strategic Analysis (SWOT)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" /> Strengths
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                    {swot.strengths?.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{item}</li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" /> Weaknesses
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                    {swot.weaknesses?.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{item}</li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2 pt-2 md:pt-0">
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 font-bold text-sm">
                    <Zap className="w-4 h-4" /> Opportunities
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                    {swot.opportunities?.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{item}</li>
                    ))}
                </ul>
            </div>

            <div className="space-y-2 pt-2 md:pt-0">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold text-sm">
                    <TrendingUp className="w-4 h-4" /> Threats
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1">
                    {swot.threats?.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{item}</li>
                    ))}
                </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Pivots */}
        <div className="flex flex-col gap-6">
            
            {/* Pivot Ideas */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-cyan-900/20 border border-cyan-200 dark:border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col flex-1 print:hidden">
                <h3 className="text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Shuffle className="w-4 h-4" /> Suggested Pivots
                </h3>
                <div className="space-y-3 flex-1">
                    {pivots?.map((pivot, i) => (
                        <button 
                            key={i}
                            onClick={() => onPivot(pivot)}
                            className="w-full text-left p-3 bg-white dark:bg-slate-900 rounded-xl border border-cyan-100 dark:border-white/5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:shadow-md hover:bg-cyan-50 dark:hover:bg-slate-800/50 transition-all group flex items-center justify-between gap-2"
                        >
                            <span className="font-medium group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors line-clamp-2">"{pivot}"</span>
                            <ArrowRight className="w-4 h-4 text-cyan-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
                        </button>
                    ))}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default SmartInsights;
