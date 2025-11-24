
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { RiskAnalysis } from '../types';
import { Skull, ShieldCheck, AlertTriangle, Activity, Play } from 'lucide-react';

interface RiskAnalyzerProps {
  analysis: RiskAnalysis | null;
  onAnalyze: () => void;
  isLoading: boolean;
}

const RiskAnalyzer: React.FC<RiskAnalyzerProps> = ({ analysis, onAnalyze, isLoading }) => {
  
  if (!analysis && !isLoading) {
    return (
        <div className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid">
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden group">
                {/* Warning stripes background */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div>
                
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600 dark:text-slate-400 relative z-10 group-hover:scale-110 transition-transform duration-500">
                    <Skull className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 relative z-10">Devil's Advocate Protocol</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 relative z-10">
                    Most startups fail because of blind spots. Run a simulation to identify fatal flaws and viability gaps before you launch.
                </p>
                <button 
                    onClick={onAnalyze}
                    className="relative z-10 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto"
                >
                    <Activity className="w-4 h-4" /> Run Risk Simulation
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-before-page">
       <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-colors relative">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Skull className="w-5 h-5 text-red-600" /> Risk & Viability Assessment
                    </h2>
                    <p className="text-sm text-slate-500">Critical failure analysis and mitigation strategies.</p>
                </div>
                {isLoading && <span className="text-red-500 font-bold animate-pulse text-sm flex items-center gap-2"><Activity className="w-4 h-4 animate-spin" /> Simulating failure scenarios...</span>}
                {analysis && !isLoading && (
                     <button 
                        onClick={onAnalyze}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Re-run Analysis"
                    >
                        <Activity className="w-4 h-4" />
                    </button>
                )}
            </div>

            {analysis && (
                <div className="p-6 md:p-8">
                    
                    <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                        {/* Viability Score Gauge */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" />
                                <circle 
                                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                                    className={`${analysis.viabilityScore > 75 ? 'text-emerald-500' : analysis.viabilityScore > 40 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                                    strokeWidth="8" 
                                    strokeDasharray="283" 
                                    strokeDashoffset={283 - (283 * analysis.viabilityScore) / 100} 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold font-display text-slate-900 dark:text-white">{analysis.viabilityScore}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Viability</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className={`text-xl font-bold mb-2 ${analysis.viabilityScore > 75 ? 'text-emerald-600 dark:text-emerald-400' : analysis.viabilityScore > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                {analysis.viabilityScore > 80 ? "Venture Looks Promising" : analysis.viabilityScore > 50 ? "Proceed with Caution" : "High Risk Detected"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                                {analysis.viabilityScore > 80 
                                    ? "The fundamental mechanics of this business appear sound, though execution remains key. The identified risks are manageable with standard operational diligence."
                                    : analysis.viabilityScore > 50
                                    ? "There are significant structural challenges in this model. While not necessarily fatal, they require specific pivots or strong differentiation to overcome."
                                    : "The current model faces existential threats. The market dynamics or unit economics may not support a sustainable business without a major pivot."
                                }
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fatal Flaws */}
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-5">
                            <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Fatal Flaws (The Killers)
                            </h4>
                            <ul className="space-y-3">
                                {analysis.fatalFlaws.map((flaw, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                                        {flaw}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mitigations */}
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5">
                            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Survival Kit (Mitigations)
                            </h4>
                            <ul className="space-y-3">
                                {analysis.mitigations.map((mitigation, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                        {mitigation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            )}

       </div>
    </div>
  );
};

export default RiskAnalyzer;
