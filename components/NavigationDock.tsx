
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { LayoutDashboard, Users, Skull, Network, Calculator, PenTool, Swords, Layers, ArrowUp } from 'lucide-react';

const NavigationDock: React.FC = () => {
  
  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (id === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
      <button 
        onClick={() => scrollToSection(id)}
        className="group relative flex items-center justify-center p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all hover:-translate-y-1 hover:scale-110"
      >
          <Icon className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors" />
          
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
              {label}
          </span>
          {/* Active indicator dot below */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </button>
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden animate-in slide-in-from-bottom-8 duration-700 delay-500">
        <div className="flex items-center gap-1 px-2 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <NavItem id="boardroom" icon={Users} label="Board Room" />
            <NavItem id="financials" icon={Calculator} label="Financials" />
            <NavItem id="risk" icon={Skull} label="Risk Analysis" />
            <NavItem id="map" icon={Network} label="Strategy Map" />
            <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <NavItem id="product-canvas" icon={Layers} label="Mockups" />
            <NavItem id="pitch" icon={PenTool} label="Pitch Kit" />
            <NavItem id="competitors" icon={Swords} label="Competitors" />
            <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button 
                onClick={() => scrollToSection('top')}
                className="group relative flex items-center justify-center p-3 rounded-xl hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all"
            >
                <ArrowUp className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
            </button>
        </div>
    </div>
  );
};

export default NavigationDock;
