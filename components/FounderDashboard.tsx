
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { BusinessInsight, RiskAnalysis, BoardMeeting, TrendData, BusinessStage, StrategyMapData } from '../types';
import { LayoutDashboard, Activity, CheckSquare, AlertTriangle, ArrowUpRight, Users, Network, Play, ShieldAlert } from 'lucide-react';

interface FounderDashboardProps {
  topic: string;
  stage: BusinessStage;
  insights: BusinessInsight;
  risk: RiskAnalysis | null;
  board: BoardMeeting | null;
  trend: TrendData | null;
  mapData: StrategyMapData | null;
  onRunRisk: () => void;
  onCallBoard: () => void;
  onBuildMap: () => void;
  isLoadingRisk: boolean;
  isLoadingBoard: boolean;
  isLoadingMap: boolean;
}

const FounderDashboard: React.FC<FounderDashboardProps> = ({
  topic,
  stage,
  insights,
  risk,
  board,
  trend,
  mapData,
  onRunRisk,
  onCallBoard,
  onBuildMap,
  isLoadingRisk,
  isLoadingBoard,
  isLoadingMap
}) => {

  // Derive Action Items
  const highPriorityActions = [
    ...(risk?.mitigations.slice(0, 2) || []),
    ...(insights.swot.opportunities.slice(0, 2) || []),
    ...(board?.advisors.filter(a => a.verdict === 'Reject' || a.verdict === 'Pivot').map(a => `Address ${a.role} concern: ${a.concern}`) || [])
  ].slice(0, 5);

  // Calculate "Data Completeness" Score
  let completeness = 25; // Base (Initial Analysis)
  if (risk) completeness += 25;
  if (board) completeness += 25;
  if (mapData) completeness += 25;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-inside-avoid">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-cyan-600" />
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Founder's Mission Control</h2>
              </div>
              <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white leading-none">{topic}</h1>
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-xs font-bold px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded uppercase tracking-wider">{stage} Phase</span>
                 <span className="text-xs text-slate-400">Strategy Completeness: {completeness}%</span>
              </div>
           </div>

           {/* Market Pulse Widget */}
           {trend && (
             <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <div className={`p-2 rounded-lg ${trend.direction === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                   <Activity className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Market Signal</p>
                   <p className="text-sm font-bold text-slate-900 dark:text-white">{trend.label}: {trend.value}</p>
                </div>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            
            {/* 1. Health & Risk Column */}
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-slate-400" /> Venture Health
                   </h3>
                   {risk && (
                      <span className={`text-xl font-bold ${risk.viabilityScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                         {risk.viabilityScore}/100
                      </span>
                   )}
                </div>

                {risk ? (
                   <div className="space-y-3">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                         <div 
                            className={`h-full rounded-full ${risk.viabilityScore > 70 ? 'bg-emerald-500' : risk.viabilityScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${risk.viabilityScore}%` }}
                         ></div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                         Primary risk identified: <span className="font-medium text-slate-700 dark:text-slate-300">{risk.fatalFlaws[0]}</span>
                      </p>
                   </div>
                ) : (
                   <div className="text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 mb-3">Viability analysis missing</p>
                      <button 
                        onClick={onRunRisk}
                        disabled={isLoadingRisk}
                        className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                      >
                        {isLoadingRisk ? 'Analyzing...' : <><Play className="w-3 h-3" /> Run Diagnostics</>}
                      </button>
                   </div>
                )}
            </div>

            {/* 2. Action Plan Column */}
            <div className="p-6 space-y-6">
               <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" /> Priority Actions
               </h3>
               
               <div className="space-y-3">
                  {highPriorityActions.length > 0 ? (
                     highPriorityActions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                           <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-transparent group-hover:text-slate-300 transition-colors cursor-pointer">
                              <div className="w-2 h-2 bg-current rounded-sm"></div>
                           </div>
                           <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{action}</p>
                        </div>
                     ))
                  ) : (
                     <p className="text-xs text-slate-400 italic">Generate deeper insights to populate your action plan.</p>
                  )}
               </div>
            </div>

            {/* 3. Strategic Board Column */}
            <div className="p-6 space-y-6">
               <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Board Sentiment
               </h3>

               {board ? (
                  <div className="space-y-4">
                     <div className="flex gap-2">
                        {board.advisors.map((advisor, i) => (
                           <div key={i} className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                              <div className="text-[10px] font-bold text-slate-400 mb-1">{advisor.role}</div>
                              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                                 advisor.verdict === 'Approve' ? 'bg-emerald-100 text-emerald-700' :
                                 advisor.verdict === 'Reject' ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'
                              }`}>
                                 {advisor.verdict}
                              </div>
                           </div>
                        ))}
                     </div>
                     <p className="text-xs text-slate-500 italic border-l-2 border-cyan-500 pl-3">
                        "{board.synthesis}"
                     </p>
                  </div>
               ) : (
                  <div className="text-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 mb-3">Board has not convened</p>
                      <button 
                        onClick={onCallBoard}
                        disabled={isLoadingBoard}
                        className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                      >
                        {isLoadingBoard ? 'Calling...' : <><Play className="w-3 h-3" /> Call Meeting</>}
                      </button>
                   </div>
               )}
               
               {/* Mini Strategy Map Trigger */}
               {!mapData && (
                   <button 
                    onClick={onBuildMap}
                    disabled={isLoadingMap}
                    className="w-full mt-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                   >
                      {isLoadingMap ? 'Mapping...' : <><Network className="w-3 h-3" /> Visualize Strategy Map</>}
                   </button>
               )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;
