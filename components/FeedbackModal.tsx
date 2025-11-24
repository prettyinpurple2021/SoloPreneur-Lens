
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, MessageSquare, Send, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to analytics endpoint
    setTimeout(() => {
      console.log('Feedback submitted:', { rating, comment });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setComment('');
        onClose();
      }, 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
             <div className="p-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
                 <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
                     <Heart className="w-8 h-8 fill-current" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Your feedback directly shapes the future of SoloPreneur Lens.</p>
             </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Help us improve</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We build features based on your requests.</p>
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Rate this app</label>
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => setRating('up')}
                            className={`p-4 rounded-xl border-2 transition-all ${rating === 'up' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 scale-105 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 text-slate-400'}`}
                            title="I like it"
                        >
                            <ThumbsUp className={`w-8 h-8 ${rating === 'up' ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setRating('down')}
                            className={`p-4 rounded-xl border-2 transition-all ${rating === 'down' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 scale-105 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 text-slate-400'}`}
                            title="Needs improvement"
                        >
                            <ThumbsDown className={`w-8 h-8 ${rating === 'down' ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Feedback</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What features are missing? What problems did you face?"
                        className="w-full h-32 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || (!rating && !comment)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                    {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Feedback</span>
                </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
