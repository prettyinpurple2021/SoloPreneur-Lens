
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PitchKit } from '../types';
import { Copy, Check, PenTool, Mic, Mail, Hash, Target, Zap, RefreshCw } from 'lucide-react';

interface PitchArchitectProps {
  pitch: PitchKit | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const PitchArchitect: React.FC<PitchArchitectProps> = ({ pitch, onGenerate, isLoading }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hook' | 'value' | 'pitch' | 'email' | 'social'>('hook');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(activeTab);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!pitch && !isLoading) {
     return (
        <div className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                    <PenTool className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Pitch Architect</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                    Turn your strategy into high-converting copy. Generate elevator pitches, cold emails, and landing page hooks instantly.
                </p>
                <button 
                    onClick={onGenerate}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 mx-auto"
                >
                    <PenTool className="w-4 h-4" /> Draft My Pitch
                </button>
            </div>
        </div>
     );
  }

  const renderContent = () => {
      if (!pitch) return null;

      switch (activeTab) {
          case 'hook':
              return (
                <div className="animate-in fade-in zoom-in duration-300">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Landing Page Headline (H1)
                    </label>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-display font-bold text-2xl md:text-3xl leading-tight">
                        {pitch.oneLiner}
                    </div>
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        Use this as the main headline on your landing page. It's designed to be punchy and capture immediate attention.
                    </p>
                </div>
              );
          case 'value':
              return (
                <div className="animate-in fade-in zoom-in duration-300">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Target className="w-3 h-3" /> Core Value Proposition
                    </label>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-lg md:text-xl italic leading-relaxed">
                        "{pitch.valueProposition}"
                    </div>
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        This is your "North Star" statement. Use it in sub-headlines, investor decks, and team alignment meetings.
                    </p>
                </div>
              );
          case 'pitch':
              return (
                <div className="animate-in fade-in zoom-in duration-300">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Mic className="w-3 h-3" /> Elevator Pitch (30 Sec)
                    </label>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base md:text-lg">
                        {pitch.elevatorPitch}
                    </div>
                </div>
              );
          case 'email':
              return (
                <div className="animate-in fade-in zoom-in duration-300">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Cold Email Template
                    </label>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-line">
                        {pitch.emailTemplate}
                    </div>
                </div>
              );
          case 'social':
              return (
                <div className="animate-in fade-in zoom-in duration-300">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Hash className="w-3 h-3" /> Social Announcement
                    </label>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                        {pitch.socialPost}
                    </div>
                </div>
              );
          default:
              return null;
      }
  };

  const getCurrentText = () => {
      if (!pitch) return '';
      switch (activeTab) {
          case 'hook': return pitch.oneLiner;
          case 'value': return pitch.valueProposition;
          case 'pitch': return pitch.elevatorPitch;
          case 'email': return pitch.emailTemplate;
          case 'social': return pitch.socialPost;
          default: return '';
      }
  }

  const NavButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap text-left w-full ${activeTab === id ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
    >
        <Icon className={`w-4 h-4 ${activeTab === id ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
        {label}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-before-page">
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <PenTool className="w-5 h-5 text-purple-600" /> Pitch Architect
                    </h2>
                    <p className="text-sm text-slate-500">AI-generated messaging kit.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <span className="text-purple-500 font-bold animate-pulse text-sm">Drafting copy...</span>}
                    {pitch && !isLoading && (
                        <button 
                            onClick={onGenerate}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors"
                            title="Regenerate Pitch"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {pitch && (
                <div className="flex flex-col md:flex-row min-h-[400px]">
                    
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
                        <NavButton id="hook" label="One-Liner Hook" icon={Zap} />
                        <NavButton id="value" label="Value Proposition" icon={Target} />
                        <NavButton id="pitch" label="Elevator Pitch" icon={Mic} />
                        <NavButton id="email" label="Cold Email" icon={Mail} />
                        <NavButton id="social" label="Social Post" icon={Hash} />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10 relative bg-slate-50/30 dark:bg-slate-900/30">
                        
                        <div className="absolute top-6 right-6 z-10">
                            <button 
                                onClick={() => handleCopy(getCurrentText())}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border transition-all ${copiedField === activeTab ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-900/50'}`}
                            >
                                {copiedField === activeTab ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span className="text-xs font-bold">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span className="text-xs font-bold">Copy Text</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {renderContent()}

                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default PitchArchitect;
