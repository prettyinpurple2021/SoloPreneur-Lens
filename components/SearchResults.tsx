
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SearchResultItem, TrendData } from '../types';
import { ExternalLink, BookOpen, Link as LinkIcon, TrendingUp, Activity } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResultItem[];
  trend?: TrendData | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, trend }) => {
  if (!results || results.length === 0) return null;

  // SVG Sparkline logic
  const Sparkline = ({ data }: { data: number[] }) => {
    if (!data || data.length < 2) return null;
    
    const width = 120;
    const height = 40;
    const max = Math.max(...data, 100);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill Area */}
        <path 
          d={`M 0,${height} ${points.split(' ').map(p => `L ${p}`).join(' ')} L ${width},${height} Z`} 
          fill="url(#sparkGradient)" 
          stroke="none" 
          className="opacity-20"
        />
        {/* Line */}
        <polyline 
          points={points} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-cyan-500 dark:text-cyan-400"
        />
        {/* End Dot */}
        {data.length > 0 && (
            <circle 
                cx={width} 
                cy={height - ((data[data.length - 1] - min) / range) * height} 
                r="3" 
                className="fill-cyan-500 dark:fill-cyan-400 animate-pulse"
            />
        )}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Enhanced Header with Trend Widget */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-t border-slate-200 dark:border-white/10 pt-8 transition-colors">
        
        {/* Left: Title */}
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <BookOpen className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Research Sources</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Verified market intelligence used for this session.</p>
            </div>
        </div>

        {/* Right: Sparkline Widget */}
        {trend && (
            <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm backdrop-blur-sm">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{trend.label || "Market Interest"}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-display font-bold text-slate-900 dark:text-white">{trend.value || "N/A"}</span>
                        {trend.direction && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                                trend.direction === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                trend.direction === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                                {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '−'} 
                                Trend
                            </span>
                        )}
                    </div>
                </div>
                <div className="pl-4 border-l border-slate-100 dark:border-white/5">
                    <Sparkline data={trend.data} />
                </div>
            </div>
        )}

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <a 
            key={index} 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex flex-col p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/0 group-hover:bg-cyan-500/50 transition-all duration-300"></div>
            
            <div className="flex items-start justify-between gap-3 mb-3">
               <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight text-sm">
                 {result.title}
               </h4>
               <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex-shrink-0 transition-colors mt-0.5" />
            </div>
            
            <div className="mt-auto flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <LinkIcon className="w-3 h-3" />
              <span className="truncate max-w-full opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                {(() => {
                  try {
                    return new URL(result.url).hostname.replace('www.', '');
                  } catch {
                    return 'External Source';
                  }
                })()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
