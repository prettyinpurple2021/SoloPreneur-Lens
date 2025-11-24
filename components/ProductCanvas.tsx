
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ProductMockup, MockupType } from '../types';
import { Layers, Smartphone, Monitor, Package, Layout, Download, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ProductCanvasProps {
  mockup: ProductMockup | null;
  onGenerate: (type: MockupType) => void;
  isLoading: boolean;
}

const ProductCanvas: React.FC<ProductCanvasProps> = ({ mockup, onGenerate, isLoading }) => {
  const [selectedType, setSelectedType] = useState<MockupType>('Mobile App');

  const handleGenerate = () => {
      onGenerate(selectedType);
  };

  if (!mockup && !isLoading) {
      return (
        <div id="product-canvas" className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid scroll-mt-24">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
                {/* Background flourish */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 relative z-10">
                    <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 relative z-10">Visionary Canvas</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 relative z-10">
                    Stop imagining, start seeing. Generate a high-fidelity mockup of your app, dashboard, or product to impress investors instantly.
                </p>
                
                <div className="flex flex-col md:flex-row justify-center gap-4 relative z-10">
                    <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {(['Mobile App', 'SaaS Dashboard', 'Physical Product', 'Marketing Website'] as MockupType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${selectedType === type ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                {type === 'Mobile App' && <Smartphone className="w-4 h-4 inline mr-1" />}
                                {type === 'SaaS Dashboard' && <Layout className="w-4 h-4 inline mr-1" />}
                                {type === 'Physical Product' && <Package className="w-4 h-4 inline mr-1" />}
                                {type === 'Marketing Website' && <Monitor className="w-4 h-4 inline mr-1" />}
                                <span className="hidden md:inline">{type.replace('Marketing ', '')}</span>
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleGenerate}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" /> Generate
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div id="product-canvas" className="w-full max-w-6xl mx-auto mt-8 print:break-before-page scroll-mt-24">
       <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Layers className="w-5 h-5 text-indigo-600" /> Visionary Canvas
                    </h2>
                    <p className="text-sm text-slate-500">AI-generated product prototype.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading ? (
                         <span className="text-indigo-500 font-bold animate-pulse text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" /> Designing...
                         </span>
                    ) : (
                         <div className="flex gap-2">
                             <a 
                                href={mockup?.imageData} 
                                download={`mockup-${mockup?.type}.png`}
                                className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                                title="Download Mockup"
                             >
                                <Download className="w-4 h-4" />
                             </a>
                             <button 
                                onClick={handleGenerate}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-bold text-xs transition-colors"
                             >
                                Regenerate
                             </button>
                         </div>
                    )}
                </div>
            </div>

            {mockup && (
                <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-slate-100 dark:bg-black/40 min-h-[400px]">
                     <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-white/20 max-w-4xl w-full">
                         {isLoading && (
                             <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
                                 <div className="flex flex-col items-center">
                                     <Layers className="w-12 h-12 text-indigo-600 animate-bounce" />
                                     <p className="text-indigo-900 dark:text-white font-bold mt-4">Rendering high-fidelity prototype...</p>
                                 </div>
                             </div>
                         )}
                         <img 
                            src={mockup.imageData} 
                            alt={mockup.caption} 
                            className="w-full h-auto object-cover"
                         />
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-white font-medium">{mockup.caption}</p>
                         </div>
                     </div>
                     <div className="mt-6 flex flex-wrap justify-center gap-2">
                         {(['Mobile App', 'SaaS Dashboard', 'Physical Product', 'Marketing Website'] as MockupType[]).map((type) => (
                             <button
                                 key={type}
                                 onClick={() => { setSelectedType(type); if(!isLoading) onGenerate(type); }}
                                 disabled={isLoading}
                                 className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-full border transition-all ${
                                     mockup.type === type 
                                     ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-700 dark:text-indigo-300' 
                                     : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-300'
                                 }`}
                             >
                                 {type}
                             </button>
                         ))}
                     </div>
                </div>
            )}
       </div>
    </div>
  );
};

export default ProductCanvas;
