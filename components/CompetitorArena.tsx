
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { CompetitorAnalysis } from '../types';
import { Swords, Shield, Globe, Zap } from 'lucide-react';

interface CompetitorArenaProps {
  analysis: CompetitorAnalysis | null;
  onAnalyze: () => void;
  isLoading: boolean;
}

const CompetitorArena: React.FC<CompetitorArenaProps> = ({ analysis, onAnalyze, isLoading }) => {
  
  if (!analysis && !isLoading) {
      return (
        <div className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                    <Swords className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Competitor Arena</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                    Use Google Search Grounding to scout real-world rivals. Uncover their weaknesses and define your competitive edge.
                </p>
                <button 
                    onClick={onAnalyze}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 mx-auto"
                >
                    <Swords className="w-4 h-4" /> Scout Competitors
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-before-page">
       <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Swords className="w-5 h-5 text-red-600" /> Competitor Arena
                    </h2>
                    <p className="text-sm text-slate-500">Real-world intelligence sourced from Google.</p>
                </div>
                {isLoading && <span className="text-red-500 font-bold animate-pulse text-sm">Scouting rivals...</span>}
            </div>

            {analysis && (
                <div className="p-6 md:p-8">
                    
                    {/* Market Gap Summary */}
                    <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl flex items-start gap-3">
                         <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                            <Zap className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wider mb-1">Identified Market Gap</p>
                            <p className="text-sm md:text-base font-medium text-slate-800 dark:text-slate-200">
                                {analysis.marketGap}
                            </p>
                         </div>
                    </div>

                    {/* Competitor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analysis.competitors.map((comp, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col hover:border-red-200 dark:hover:border-red-900/50 transition-colors group">
                                <div className="mb-4">
                                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">{comp.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{comp.description}</p>
                                </div>

                                <div className="space-y-4 flex-1">
                                    {/* Their Edge */}
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
                                            <Globe className="w-3 h-3" /> Their Edge
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300">{comp.theirEdge}</p>
                                    </div>

                                    {/* Your Edge */}
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex-1">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                                            <Shield className="w-3 h-3" /> Your Advantage
                                        </div>
                                        <p className="text-xs text-slate-800 dark:text-emerald-100 font-medium">{comp.yourEdge}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

       </div>
    </div>
  );
};

export default CompetitorArena;
