
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { FinancialModel } from '../types';
import { Calculator, DollarSign, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface FinancialModelerProps {
  model: FinancialModel | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const FinancialModeler: React.FC<FinancialModelerProps> = ({ model, onGenerate, isLoading }) => {
  const [price, setPrice] = useState(0);
  const [cac, setCac] = useState(0);
  const [cogs, setCogs] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    if (model) {
      setPrice(model.metrics.price);
      setCac(model.metrics.cac);
      setCogs(model.metrics.cogs);
      setUsers(model.metrics.users);
    }
  }, [model]);

  // Calculations
  const monthlyRevenue = price * users;
  const grossMargin = price - cogs;
  const totalCost = (cogs * users) + (cac * (users * 0.1)); // Assuming 10% new user growth monthly for cost calculation simplicity
  const profit = monthlyRevenue - totalCost;
  const breakEvenUsers = grossMargin > 0 ? Math.ceil(2000 / grossMargin) : '∞'; // Assuming $2000 fixed monthly costs for solo founder

  if (!model && !isLoading) {
      return null; // Hidden until generated via Dashboard or specifically requested
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid">
       <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
          
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div>
                  <h2 className="text-xl font-display font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Calculator className="w-5 h-5 text-emerald-600" /> Napkin Math
                  </h2>
                  <p className="text-sm text-slate-500">Unit economics simulator. Adjust the sliders to test viability.</p>
              </div>
              {!model && isLoading && <span className="text-emerald-500 font-bold animate-pulse text-sm">Crunching numbers...</span>}
              {model && (
                  <button 
                     onClick={onGenerate}
                     className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                     title="Regenerate Estimates"
                  >
                     <RefreshCw className="w-4 h-4" />
                  </button>
              )}
          </div>

          {model ? (
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Controls */}
                  <div className="space-y-6">
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50 mb-6">
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">AI Insight</p>
                          <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">"{model.insight}"</p>
                      </div>

                      {/* Sliders */}
                      <div className="space-y-1">
                          <div className="flex justify-between text-sm font-bold">
                              <label className="text-slate-500">Price ({model.currency})</label>
                              <span className="text-slate-900 dark:text-white">{price}</span>
                          </div>
                          <input 
                              type="range" min="1" max="500" step="1" value={price} 
                              onChange={(e) => setPrice(Number(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                      </div>

                      <div className="space-y-1">
                          <div className="flex justify-between text-sm font-bold">
                              <label className="text-slate-500">CAC (Cost to Acquire)</label>
                              <span className="text-slate-900 dark:text-white">{cac}</span>
                          </div>
                          <input 
                              type="range" min="0" max="200" step="1" value={cac} 
                              onChange={(e) => setCac(Number(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                          />
                      </div>

                      <div className="space-y-1">
                          <div className="flex justify-between text-sm font-bold">
                              <label className="text-slate-500">COGS (Cost per User)</label>
                              <span className="text-slate-900 dark:text-white">{cogs}</span>
                          </div>
                          <input 
                              type="range" min="0" max="100" step="0.5" value={cogs} 
                              onChange={(e) => setCogs(Number(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                          />
                      </div>

                      <div className="space-y-1">
                          <div className="flex justify-between text-sm font-bold">
                              <label className="text-slate-500">Active Users (Year 1)</label>
                              <span className="text-slate-900 dark:text-white">{users}</span>
                          </div>
                          <input 
                              type="range" min="10" max="10000" step="10" value={users} 
                              onChange={(e) => setUsers(Number(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                      </div>
                  </div>

                  {/* Results */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                          <div>
                              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Monthly Revenue</p>
                              <p className="text-2xl font-display font-bold text-white">
                                  {model.currency}{monthlyRevenue.toLocaleString()}
                              </p>
                          </div>
                          <div>
                              <p className="text-slate-400 text-xs uppercase font-bold mb-1">Est. Profit</p>
                              <p className={`text-2xl font-display font-bold ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {model.currency}{profit.toLocaleString()}
                              </p>
                          </div>
                      </div>

                      <div className="space-y-4">
                           <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-blue-500/20 rounded-lg text-blue-300"><Users className="w-4 h-4" /></div>
                                   <div className="text-sm">
                                       <p className="font-bold text-slate-200">Break-Even Users</p>
                                       <p className="text-xs text-slate-400">To cover $2k/mo fixed costs</p>
                                   </div>
                               </div>
                               <div className="text-xl font-bold font-mono text-white">{breakEvenUsers}</div>
                           </div>

                           <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300"><TrendingUp className="w-4 h-4" /></div>
                                   <div className="text-sm">
                                       <p className="font-bold text-slate-200">LTV / CAC Ratio</p>
                                       <p className="text-xs text-slate-400">Target {'>'} 3.0</p>
                                   </div>
                               </div>
                               <div className={`text-xl font-bold font-mono ${grossMargin/cac > 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                   {cac > 0 ? (grossMargin * 12 / cac).toFixed(1) : '∞'}x
                               </div>
                           </div>
                      </div>
                  </div>

              </div>
          ) : (
            <div className="p-12 text-center opacity-60">
                 <p className="text-slate-500 dark:text-slate-500 font-medium mb-4">No financial model generated yet.</p>
                 <button 
                    onClick={onGenerate}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-all text-sm shadow-lg"
                 >
                    Calculate Estimates
                 </button>
            </div>
          )}

       </div>
    </div>
  );
};

export default FinancialModeler;
