
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { BusinessStage, VisualStyle, BusinessFocus } from '../types';
import { User, Save, X, Settings, Rocket, Palette, Target } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: BusinessStage;
  currentStyle: VisualStyle;
  currentFocus: BusinessFocus;
  onSave: (stage: BusinessStage, style: VisualStyle, focus: BusinessFocus) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  currentStage, 
  currentStyle, 
  currentFocus, 
  onSave 
}) => {
  const [stage, setStage] = useState<BusinessStage>(currentStage);
  const [style, setStyle] = useState<VisualStyle>(currentStyle);
  const [focus, setFocus] = useState<BusinessFocus>(currentFocus);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setStage(currentStage);
        setStyle(currentStyle);
        setFocus(currentFocus);
        setIsSaved(false);
    }
  }, [isOpen, currentStage, currentStyle, currentFocus]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const profile = { stage, style, focus };
    localStorage.setItem('solopreneur_profile', JSON.stringify(profile));
    
    // Update App State
    onSave(stage, style, focus);
    
    setIsSaved(true);
    setTimeout(() => {
        setIsSaved(false);
        onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto mb-4">
                    <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Founder Profile</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set your default preferences for faster workflows.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Stage */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Rocket className="w-3 h-3" /> Default Business Stage
                    </label>
                    <div className="relative">
                        <select 
                            value={stage}
                            onChange={(e) => setStage(e.target.value as BusinessStage)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white appearance-none"
                        >
                            <option value="Ideation">Ideation</option>
                            <option value="MVP">MVP / Launch</option>
                            <option value="Growth">Growth</option>
                            <option value="Scale">Scale</option>
                        </select>
                        <Settings className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Style */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Preferred Aesthetic
                    </label>
                    <div className="relative">
                        <select 
                            value={style}
                            onChange={(e) => setStyle(e.target.value as VisualStyle)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white appearance-none"
                        >
                            <option value="Modern SaaS">Modern SaaS</option>
                            <option value="Tech Dark">Tech Dark</option>
                            <option value="Whiteboard">Whiteboard</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Vibrant Startup">Vibrant Startup</option>
                            <option value="Data Professional">Data Professional</option>
                        </select>
                        <Settings className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Focus */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-3 h-3" /> Primary Focus Area
                    </label>
                    <div className="relative">
                        <select 
                            value={focus}
                            onChange={(e) => setFocus(e.target.value as BusinessFocus)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white appearance-none"
                        >
                            <option value="Strategy">Strategy</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Product">Product</option>
                            <option value="Investors">Investors</option>
                            <option value="Sales">Sales</option>
                            <option value="Operations">Operations</option>
                        </select>
                        <Settings className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95 ${
                        isSaved 
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-slate-900/10'
                    }`}
                >
                    {isSaved ? (
                        <>Saved!</>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Preferences</span>
                        </>
                    )}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
