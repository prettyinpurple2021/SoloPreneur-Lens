
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { BoardMeeting, BoardMessage } from '../types';
import { Briefcase, Megaphone, Terminal, User, CheckCircle, XCircle, RefreshCw, Quote, Send, MessageSquare } from 'lucide-react';

interface BoardRoomProps {
  boardMeeting: BoardMeeting | null;
  onGenerate: () => void;
  onChat: (msg: string) => void;
  isLoading: boolean;
  isChatting: boolean;
}

const BoardRoom: React.FC<BoardRoomProps> = ({ boardMeeting, onGenerate, onChat, isLoading, isChatting }) => {
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [boardMeeting?.chatHistory]);

  const handleSubmitChat = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || isChatting) return;
      onChat(chatInput);
      setChatInput('');
  };
  
  const renderIcon = (role: string) => {
      switch(role) {
          case 'CFO': return <Briefcase className="w-5 h-5" />;
          case 'CMO': return <Megaphone className="w-5 h-5" />;
          case 'CTO': return <Terminal className="w-5 h-5" />;
          default: return <User className="w-5 h-5" />;
      }
  };

  const renderVerdict = (verdict: string) => {
      switch(verdict) {
          case 'Approve': return <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full uppercase tracking-wide border border-emerald-200 dark:border-emerald-900/50"><CheckCircle className="w-3 h-3" /> Approve</span>;
          case 'Reject': return <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full uppercase tracking-wide border border-red-200 dark:border-red-900/50"><XCircle className="w-3 h-3" /> Reject</span>;
          default: return <span className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full uppercase tracking-wide border border-amber-200 dark:border-amber-900/50"><RefreshCw className="w-3 h-3" /> Pivot</span>;
      }
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 print:break-before-page">
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative transition-colors">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950">
                <div>
                    <h2 className="text-xl font-display font-bold flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        AI Board of Directors
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Simulating conflicting C-suite perspectives to cure decision fatigue.</p>
                </div>
                {!boardMeeting && !isLoading && (
                    <button 
                        onClick={onGenerate}
                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-sm shadow-lg"
                    >
                        Call Meeting
                    </button>
                )}
                {isLoading && <span className="text-sm text-cyan-600 dark:text-cyan-400 font-mono animate-pulse">Advisors entering the room...</span>}
            </div>

            {/* Board Room Content */}
            {boardMeeting && (
                <div className="flex flex-col md:flex-row">
                    
                    {/* Main Cards (Left Side on Desktop) */}
                    <div className="flex-1 p-6 md:p-8 bg-white dark:bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-black animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 gap-4">
                            {boardMeeting.advisors.map((advisor, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col relative group hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md font-bold"
                                                style={{ backgroundColor: advisor.avatarColor || '#64748b' }}
                                            >
                                                {renderIcon(advisor.role)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{advisor.name}</h4>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{advisor.role}</p>
                                            </div>
                                        </div>
                                        {renderVerdict(advisor.verdict)}
                                    </div>
                                    <div className="bg-white dark:bg-slate-900/80 rounded-lg p-3 text-xs md:text-sm italic text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                                        "{advisor.advice}"
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Synthesis */}
                        <div className="mt-4 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex gap-3 shadow-sm">
                            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg shrink-0 h-fit">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Discussion Synthesis</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{boardMeeting.synthesis}</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section (Right Side on Desktop) */}
                    <div className="w-full md:w-96 bg-slate-50 dark:bg-black/20 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col h-[500px] md:h-auto">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                             <h3 className="text-sm font-bold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Debate the Board</h3>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                             {boardMeeting.chatHistory?.map((msg, idx) => (
                                 <div key={idx} className={`flex flex-col ${msg.role === 'User' ? 'items-end' : 'items-start'}`}>
                                     <div className={`text-[10px] font-bold mb-1 ${msg.role === 'User' ? 'text-cyan-600' : 'text-slate-500'}`}>
                                         {msg.role === 'User' ? 'You' : `${msg.role} (${msg.name})`}
                                     </div>
                                     <div className={`p-3 rounded-xl text-sm max-w-[90%] ${
                                         msg.role === 'User' 
                                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                     }`}>
                                         {msg.text}
                                     </div>
                                 </div>
                             ))}
                             {isChatting && (
                                 <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                     Board is deliberating...
                                 </div>
                             )}
                             <div ref={chatEndRef}></div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmitChat} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask a follow-up question..."
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-cyan-500"
                                    disabled={isChatting}
                                />
                                <button 
                                    type="submit"
                                    disabled={isChatting || !chatInput.trim()}
                                    className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!boardMeeting && !isLoading && (
                <div className="p-12 text-center opacity-60">
                    <div className="flex justify-center gap-4 mb-4 grayscale opacity-50">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 font-medium">The Board Room is empty. Call a meeting to get expert opinions.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default BoardRoom;
