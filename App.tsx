
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedImage, BusinessStage, VisualStyle, BusinessFocus, SearchResultItem, BusinessInsight, TrendData, RiskAnalysis, BoardMeeting, StrategyMapData, PitchKit, CompetitorAnalysis, FinancialModel, ProductMockup, MockupType } from './types';
import { 
  researchTopicForPrompt, 
  generateInfographicImage, 
  editInfographicImage,
  optimizePrompt,
  generateAudioBrief,
  generateRiskAnalysis,
  generateBoardMeeting,
  generateStrategyMap,
  generatePitchKit,
  analyzeCompetitors,
  askBoardQuestion,
  generateFinancialModel,
  generateProductMockup
} from './services/geminiService';
import Infographic from './components/Infographic';
import Loading from './components/Loading';
import IntroScreen from './components/IntroScreen';
import SearchResults from './components/SearchResults';
import SmartInsights from './components/SmartInsights';
import BoardRoom from './components/BoardRoom';
import StrategyMap from './components/StrategyMap';
import FounderDashboard from './components/FounderDashboard';
import PitchArchitect from './components/PitchArchitect';
import CompetitorArena from './components/CompetitorArena';
import RiskAnalyzer from './components/RiskAnalyzer';
import FinancialModeler from './components/FinancialModeler';
import ProductCanvas from './components/ProductCanvas';
import NavigationDock from './components/NavigationDock';
import FeedbackModal from './components/FeedbackModal';
import ProfileModal from './components/ProfileModal';
import { Search, AlertCircle, History, Rocket, Palette, Target, Atom, Compass, Sun, Moon, Key, CreditCard, ExternalLink, DollarSign, Wand2, Trash2, MessageSquare, User } from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [topic, setTopic] = useState('');
  
  const [businessStage, setBusinessStage] = useState<BusinessStage>('Ideation');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Modern SaaS');
  const [businessFocus, setBusinessFocus] = useState<BusinessFocus>('Strategy');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  const [currentInsights, setCurrentInsights] = useState<BusinessInsight | null>(null);
  const [currentTrend, setCurrentTrend] = useState<TrendData | null>(null);
  const [currentFacts, setCurrentFacts] = useState<string[]>([]);
  
  // Risk Analysis State
  const [currentRisk, setCurrentRisk] = useState<RiskAnalysis | null>(null);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);

  // Board Room State
  const [currentBoardMeeting, setCurrentBoardMeeting] = useState<BoardMeeting | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);
  const [isBoardChatting, setIsBoardChatting] = useState(false);

  // Strategy Map State
  const [currentStrategyMap, setCurrentStrategyMap] = useState<StrategyMapData | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  // Pitch Architect State
  const [currentPitch, setCurrentPitch] = useState<PitchKit | null>(null);
  const [isLoadingPitch, setIsLoadingPitch] = useState(false);

  // Competitor Arena State
  const [currentCompetitors, setCurrentCompetitors] = useState<CompetitorAnalysis | null>(null);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(false);

  // Financial Model State
  const [currentFinancials, setCurrentFinancials] = useState<FinancialModel | null>(null);
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(false);

  // Product Mockup State
  const [currentMockup, setCurrentMockup] = useState<ProductMockup | null>(null);
  const [isLoadingMockup, setIsLoadingMockup] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Audio State
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // API Key State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load User Profile on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('solopreneur_profile');
    if (savedProfile) {
        try {
            const { stage, style, focus } = JSON.parse(savedProfile);
            if (stage) setBusinessStage(stage);
            if (style) setVisualStyle(style);
            if (focus) setBusinessFocus(focus);
        } catch (e) {
            console.error("Failed to load profile", e);
        }
    }
  }, []);

  // Check for API Key on Mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
          // Development environment fallback or if not running in AI Studio context
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success due to race condition logic mentioned in guidelines
        setHasApiKey(true);
        setError(null);
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    }
  };

  const handleSmartOptimize = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!topic.trim() || isOptimizing) return;
    
    setIsOptimizing(true);
    try {
        const enhanced = await optimizePrompt(topic, businessStage);
        setTopic(enhanced);
    } catch (e) {
        console.error("Optimization failed", e);
    } finally {
        setIsOptimizing(false);
    }
  };

  const handleSaveProfile = (stage: BusinessStage, style: VisualStyle, focus: BusinessFocus) => {
      setBusinessStage(stage);
      setVisualStyle(style);
      setBusinessFocus(focus);
  };

  const runGeneration = async (searchTopic: string) => {
    if (isLoading) return;

    if (!searchTopic.trim()) {
        setError("Please enter a business topic to visualize.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);
    setLoadingFacts([]);
    setCurrentSearchResults([]);
    setCurrentInsights(null);
    setCurrentTrend(null);
    setCurrentFacts([]);
    setCurrentRisk(null); // Reset risk
    setCurrentBoardMeeting(null); // Reset Board
    setCurrentStrategyMap(null); // Reset Map
    setCurrentPitch(null); // Reset Pitch
    setCurrentCompetitors(null); // Reset Competitors
    setCurrentFinancials(null); // Reset Financials
    setCurrentMockup(null); // Reset Mockup
    setLoadingMessage(`Analyzing Market Data...`);
    stopAudio(); // Stop any playing audio

    try {
      // Step 1: Research and Construct Prompt
      const researchResult = await researchTopicForPrompt(searchTopic, businessStage, visualStyle, businessFocus);
      
      setLoadingFacts(researchResult.facts);
      setCurrentFacts(researchResult.facts);
      setCurrentSearchResults(researchResult.searchResults);
      setCurrentInsights(researchResult.insights);
      setCurrentTrend(researchResult.trend);
      
      setLoadingStep(2);
      setLoadingMessage(`Generating Strategy Visual...`);
      
      // Step 2: Direct Image Generation
      let base64Data = await generateInfographicImage(researchResult.imagePrompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        data: base64Data,
        prompt: searchTopic,
        timestamp: Date.now(),
        stage: businessStage,
        style: visualStyle,
        focus: businessFocus
      };

      setImageHistory([newImage, ...imageHistory]);
    } catch (err: any) {
      console.error(err);
      // Check for specific billing/key errors
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
          setError("Access denied. The selected API key does not have access to the required models. Please select a project with billing enabled.");
          setHasApiKey(false); // Force the key selection modal to reappear
      } else {
          setError('The visual engine is temporarily unavailable. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await runGeneration(topic);
  };

  const handlePivot = async (pivotIdea: string) => {
      setTopic(pivotIdea);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Immediate generation for better responsiveness
      runGeneration(pivotIdea);
  };

  const handleAnalyzeRisk = async (): Promise<RiskAnalysis | null> => {
      if (!imageHistory[0]?.prompt || isLoadingRisk) return null;
      setIsLoadingRisk(true);
      try {
          const risk = await generateRiskAnalysis(imageHistory[0].prompt, businessStage, businessFocus);
          setCurrentRisk(risk);
          return risk;
      } catch (e) {
          console.error("Risk analysis failed", e);
          return null;
      } finally {
          setIsLoadingRisk(false);
      }
  }

  const handleCallBoardMeeting = async () => {
      if (!imageHistory[0]?.prompt || isLoadingBoard) return;
      setIsLoadingBoard(true);
      try {
          const meeting = await generateBoardMeeting(imageHistory[0].prompt, businessStage);
          setCurrentBoardMeeting(meeting);
      } catch (e) {
          console.error("Board meeting failed", e);
      } finally {
          setIsLoadingBoard(false);
      }
  }

  const handleBoardChat = async (message: string) => {
    if (!currentBoardMeeting || isBoardChatting) return;
    setIsBoardChatting(true);
    
    // Optimistic update
    const userMsg = { role: 'User', name: 'You', text: message, timestamp: Date.now() } as const;
    const updatedMeeting = {
        ...currentBoardMeeting,
        chatHistory: [...(currentBoardMeeting.chatHistory || []), userMsg]
    };
    setCurrentBoardMeeting(updatedMeeting);

    try {
        const responses = await askBoardQuestion(updatedMeeting, message);
        setCurrentBoardMeeting(prev => prev ? {
            ...prev,
            chatHistory: [...(prev.chatHistory || []), ...responses]
        } : null);
    } catch (e) {
        console.error("Board chat failed", e);
    } finally {
        setIsBoardChatting(false);
    }
  };

  const handleGenerateMap = async () => {
      if (!imageHistory[0]?.prompt || isLoadingMap) return;
      setIsLoadingMap(true);
      try {
          const mapData = await generateStrategyMap(imageHistory[0].prompt, businessStage);
          setCurrentStrategyMap(mapData);
      } catch (e) {
          console.error("Strategy map failed", e);
      } finally {
          setIsLoadingMap(false);
      }
  }

  const handleGeneratePitch = async () => {
    if (!imageHistory[0]?.prompt || isLoadingPitch) return;
    setIsLoadingPitch(true);
    try {
        const pitch = await generatePitchKit(imageHistory[0].prompt, businessStage, businessFocus);
        setCurrentPitch(pitch);
    } catch (e) {
        console.error("Pitch generation failed", e);
    } finally {
        setIsLoadingPitch(false);
    }
  }

  const handleAnalyzeCompetitors = async () => {
    if (!imageHistory[0]?.prompt || isLoadingCompetitors) return;
    setIsLoadingCompetitors(true);
    try {
        const analysis = await analyzeCompetitors(imageHistory[0].prompt);
        setCurrentCompetitors(analysis);
    } catch (e) {
        console.error("Competitor analysis failed", e);
    } finally {
        setIsLoadingCompetitors(false);
    }
  }

  const handleGenerateFinancials = async () => {
    if (!imageHistory[0]?.prompt || isLoadingFinancials) return;
    setIsLoadingFinancials(true);
    try {
        const financials = await generateFinancialModel(imageHistory[0].prompt, businessStage);
        setCurrentFinancials(financials);
    } catch (e) {
        console.error("Financial model failed", e);
    } finally {
        setIsLoadingFinancials(false);
    }
  }

  const handleGenerateMockup = async (type: MockupType) => {
    if (!imageHistory[0]?.prompt || isLoadingMockup) return;
    setIsLoadingMockup(true);
    try {
        const mockup = await generateProductMockup(imageHistory[0].prompt, type, visualStyle);
        setCurrentMockup(mockup);
    } catch (e) {
        console.error("Mockup generation failed", e);
    } finally {
        setIsLoadingMockup(false);
    }
  }

  const handleEdit = async (editPrompt: string) => {
    if (imageHistory.length === 0) return;
    const currentImage = imageHistory[0];
    setIsLoading(true);
    setError(null);
    setLoadingStep(2);
    setLoadingMessage(`Refining Strategy: "${editPrompt}"...`);

    try {
      const base64Data = await editInfographicImage(currentImage.data, editPrompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        data: base64Data,
        prompt: editPrompt,
        timestamp: Date.now(),
        stage: currentImage.stage,
        style: currentImage.style,
        focus: currentImage.focus
      };
      setImageHistory([newImage, ...imageHistory]);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
          setError("Access denied. Please select a valid API key with billing enabled.");
          setHasApiKey(false);
      } else {
          setError('Modification failed. Try a different command.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleClearHistory = () => {
      if (window.confirm("Clear all strategy history? This cannot be undone.")) {
          setImageHistory([]);
          setCurrentInsights(null);
          setCurrentTrend(null);
          setCurrentRisk(null);
          setCurrentBoardMeeting(null);
          setCurrentStrategyMap(null);
          setCurrentPitch(null);
          setCurrentCompetitors(null);
          setCurrentFinancials(null);
          setCurrentMockup(null);
          setCurrentSearchResults([]);
      }
  }

  // --- Audio Logic ---

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // ignore
      }
      audioSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const handlePlayAudioBrief = async () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (!currentInsights || !imageHistory[0]) return;
    
    setIsGeneratingAudio(true);
    try {
      const base64Audio = await generateAudioBrief(
        imageHistory[0].prompt, 
        currentInsights, 
        currentFacts
      );

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      // Decode
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlayingAudio(false);
      
      audioSourceRef.current = source;
      source.start(0);
      setIsPlayingAudio(true);

    } catch (e) {
      console.error("Audio generation failed", e);
      setError("Could not generate audio brief. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleCopyReport = () => {
    // ... (Existing report generation logic - no changes needed, but ensuring new state would be included if expanded)
    if (!currentInsights || imageHistory.length === 0) return;
    const img = imageHistory[0];
    const report = `
# SoloPreneur Lens: Strategy Report
**Topic:** ${img.prompt}
**Stage:** ${img.stage} | **Focus:** ${img.focus}

## Key Market Facts
${currentFacts.map(f => `- ${f}`).join('\n')}

## SWOT Analysis
**Strengths:**
${currentInsights.swot.strengths.map(s => `- ${s}`).join('\n')}

**Weaknesses:**
${currentInsights.swot.weaknesses.map(w => `- ${w}`).join('\n')}

**Opportunities:**
${currentInsights.swot.opportunities.map(o => `- ${o}`).join('\n')}

**Threats:**
${currentInsights.swot.threats.map(t => `- ${t}`).join('\n')}

${currentRisk ? `
## Risk Analysis
**Viability Score:** ${currentRisk.viabilityScore}/100
**Fatal Flaws:**
${currentRisk.fatalFlaws.map(f => `- ${f}`).join('\n')}
` : ''}

${currentFinancials ? `
## Financial Estimates
**Price:** ${currentFinancials.currency}${currentFinancials.metrics.price} | **CAC:** ${currentFinancials.currency}${currentFinancials.metrics.cac}
` : ''}

*Generated by SoloPreneur Lens*
    `;
    navigator.clipboard.writeText(report.trim());
  };

  const restoreImage = (img: GeneratedImage) => {
     const newHistory = imageHistory.filter(i => i.id !== img.id);
     setImageHistory([img, ...newHistory]);
     setCurrentInsights(null);
     setCurrentTrend(null);
     setCurrentFacts([]);
     setCurrentSearchResults([]);
     setCurrentRisk(null);
     setCurrentBoardMeeting(null);
     setCurrentStrategyMap(null);
     setCurrentPitch(null);
     setCurrentCompetitors(null);
     setCurrentFinancials(null);
     setCurrentMockup(null);
  };

  // Modal for API Key Selection
  const KeySelectionModal = () => (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
            
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 border-4 border-white dark:border-slate-900 shadow-lg">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white dark:border-slate-900 uppercase tracking-wide">
                        Paid App
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                        Paid API Key Required
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                        This application uses premium Gemini 3 Pro models which are not available on the free tier.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        You must select a Google Cloud Project with <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1 py-0.5 rounded">Billing Enabled</span> to proceed.
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 w-full text-left">
                    <div className="flex items-start gap-3">
                         <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                            <DollarSign className="w-4 h-4" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">Billing Required</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Standard API keys will fail. Please ensure you have set up billing in Google AI Studio.
                            </p>
                             <a 
                                href="https://ai.google.dev/gemini-api/docs/billing" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline mt-1"
                            >
                                View Billing Documentation <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                    </div>
                </div>

                <button 
                    onClick={handleSelectKey}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <Key className="w-4 h-4" />
                    <span>Select Paid API Key</span>
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <>
    {/* Block usage if key is missing */}
    {!checkingKey && !hasApiKey && <KeySelectionModal />}

    {/* Global Feedback Modal */}
    <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
    />
    
    {/* User Profile Modal */}
    <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentStage={businessStage}
        currentStyle={visualStyle}
        currentFocus={businessFocus}
        onSave={handleSaveProfile}
    />

    {showIntro ? (
      <IntroScreen onComplete={() => setShowIntro(false)} />
    ) : (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-500 selection:text-white pb-28 relative overflow-x-hidden animate-in fade-in duration-1000 transition-colors print:bg-white print:text-black">
      
      {/* Background Elements (Hide in Print) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-indigo-900 dark:via-slate-950 dark:to-black z-0 transition-colors print:hidden"></div>
      <div className="fixed inset-0 opacity-5 dark:opacity-20 z-0 pointer-events-none print:hidden" style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }}></div>

      {/* Navbar (Hide in Print) */}
      <header className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/60 transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group">
            <div className="relative scale-90 md:scale-100">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 dark:opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 relative z-10 shadow-sm dark:shadow-none">
                   <Atom className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-[spin_10s_linear_infinite]" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="font-display font-bold text-lg md:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                SoloPreneur <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-amber-400">Lens</span>
                </span>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">Visual Strategy Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors border border-slate-200 dark:border-white/10"
                title="Send Feedback"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Feedback</span>
              </button>

              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors border border-slate-200 dark:border-white/10"
                title="User Profile & Settings"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button 
                onClick={handleSelectKey}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors border border-slate-200 dark:border-white/10"
                title="Change API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">API Key</span>
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
          </div>
        </div>
      </header>

      {/* Print Header (Only visible in print) */}
      <div className="hidden print:block p-6 border-b border-black text-center">
          <h1 className="text-2xl font-bold mb-1">SoloPreneur Lens Strategy Report</h1>
          <p className="text-sm text-gray-500">Generated by Google Gemini 3 Pro</p>
      </div>

      <main className="px-3 sm:px-6 py-4 md:py-8 relative z-10">
        
        <div className={`max-w-6xl mx-auto transition-all duration-500 ${imageHistory.length > 0 ? 'mb-4 md:mb-8' : 'min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center'} print:hidden`}>
          
          {!imageHistory.length && (
            <div className="text-center mb-6 md:mb-16 space-y-3 md:space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-600 dark:text-amber-300 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm dark:shadow-[0_0_20px_rgba(251,191,36,0.1)] backdrop-blur-sm">
                <Compass className="w-3 h-3 md:w-4 md:h-4" /> Empowering Solo Founders with AI
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-[0.95] md:leading-[0.9]">
                Visualize <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400">Your Venture.</span>
              </h1>
              <p className="text-sm md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed px-4">
                Generate pitch-ready diagrams, market infographics, and strategy visuals powered by Google search grounding.
              </p>
            </div>
          )}

          {/* Search Form (Hide in Print) */}
          <form onSubmit={handleGenerate} className={`relative z-20 transition-all duration-300 ${isLoading ? 'opacity-50 pointer-events-none scale-95 blur-sm' : 'scale-100'}`}>
            
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 rounded-3xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition duration-500 blur-xl"></div>
                
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-3xl shadow-2xl">
                    
                    {/* Main Input */}
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 md:left-6 w-5 h-5 md:w-6 md:h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Describe your business idea, strategy, or market..."
                            className="w-full pl-12 md:pl-16 pr-14 md:pr-20 py-3 md:py-6 bg-transparent border-none outline-none text-base md:text-2xl placeholder:text-slate-400 font-medium text-slate-900 dark:text-white"
                        />
                        {/* Smart Enhance Button */}
                        <button
                            type="button"
                            onClick={handleSmartOptimize}
                            disabled={isOptimizing || !topic.trim()}
                            className={`absolute right-4 md:right-6 p-2 rounded-lg transition-all ${isOptimizing ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500' : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            title="Smart Enhance (Refine with AI)"
                        >
                            <Wand2 className={`w-5 h-5 md:w-6 md:h-6 ${isOptimizing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row gap-2 p-2 mt-2">
                    
                    {/* Stage Selector */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-cyan-500/30 transition-colors relative overflow-hidden group/item">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
                            <Rocket className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stage</label>
                            <select 
                                value={businessStage} 
                                onChange={(e) => setBusinessStage(e.target.value as BusinessStage)}
                                className="bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors truncate pr-4 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                            >
                                <option value="Ideation">Ideation</option>
                                <option value="MVP">MVP / Launch</option>
                                <option value="Growth">Growth</option>
                                <option value="Scale">Scale</option>
                            </select>
                        </div>
                    </div>

                    {/* Style Selector */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-purple-500/30 transition-colors relative overflow-hidden group/item">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                            <Palette className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aesthetic</label>
                            <select 
                                value={visualStyle} 
                                onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                                className="bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-purple-600 dark:hover:text-purple-300 transition-colors truncate pr-4 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                            >
                                <option value="Modern SaaS">Modern SaaS</option>
                                <option value="Tech Dark">Tech Dark</option>
                                <option value="Whiteboard">Whiteboard</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Vibrant Startup">Vibrant Startup</option>
                                <option value="Data Professional">Data Professional</option>
                            </select>
                        </div>
                    </div>

                     {/* Focus Selector */}
                     <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-green-500/30 transition-colors relative overflow-hidden group/item">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-green-600 dark:text-green-400 shrink-0 shadow-sm">
                            <Target className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Focus</label>
                            <select 
                                value={businessFocus} 
                                onChange={(e) => setBusinessFocus(e.target.value as BusinessFocus)}
                                className="bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-green-600 dark:hover:text-green-300 transition-colors truncate pr-4 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                            >
                                <option value="Strategy">Strategy</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Product">Product</option>
                                <option value="Investors">Investors</option>
                                <option value="Sales">Sales</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto h-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold font-display tracking-wide hover:brightness-110 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Rocket className="w-5 h-5" />
                            <span>LAUNCH</span>
                        </button>
                        <div className="text-center">
                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider opacity-70">Visual Engine</span>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
          </form>
        </div>

        {isLoading && <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />}

        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-4 text-red-800 dark:text-red-200 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 shadow-sm print:hidden">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
            <div className="flex-1">
                <p className="font-medium">{error}</p>
                {(error.includes("Access denied") || error.includes("billing")) && (
                    <button 
                        onClick={handleSelectKey}
                        className="mt-2 text-xs font-bold text-red-700 dark:text-red-300 underline hover:text-red-900 dark:hover:text-red-100"
                    >
                        Select a different API key
                    </button>
                )}
            </div>
          </div>
        )}

        {imageHistory.length > 0 && !isLoading && (
            <>
                {/* Navigation Dock */}
                <NavigationDock />

                <Infographic 
                    image={imageHistory[0]} 
                    onEdit={handleEdit} 
                    isEditing={isLoading}
                    onPlayAudio={handlePlayAudioBrief}
                    onCopyReport={handleCopyReport}
                    isPlayingAudio={isPlayingAudio}
                    isGeneratingAudio={isGeneratingAudio}
                    hasInsights={!!currentInsights}
                />
                
                {/* Executive Dashboard */}
                {currentInsights && (
                  <div id="dashboard" className="scroll-mt-24">
                      <FounderDashboard 
                        topic={imageHistory[0].prompt}
                        stage={imageHistory[0].stage || 'Ideation'}
                        insights={currentInsights}
                        risk={currentRisk}
                        board={currentBoardMeeting}
                        trend={currentTrend}
                        mapData={currentStrategyMap}
                        onRunRisk={handleAnalyzeRisk}
                        onCallBoard={handleCallBoardMeeting}
                        onBuildMap={handleGenerateMap}
                        isLoadingRisk={isLoadingRisk}
                        isLoadingBoard={isLoadingBoard}
                        isLoadingMap={isLoadingMap}
                      />
                  </div>
                )}
                
                {/* Board Room */}
                <div id="boardroom" className="scroll-mt-24">
                    <BoardRoom 
                        boardMeeting={currentBoardMeeting} 
                        onGenerate={handleCallBoardMeeting} 
                        onChat={handleBoardChat}
                        isLoading={isLoadingBoard}
                        isChatting={isBoardChatting}
                    />
                </div>

                {/* Financial Modeler */}
                <div id="financials" className="scroll-mt-24">
                    <FinancialModeler
                        model={currentFinancials}
                        onGenerate={handleGenerateFinancials}
                        isLoading={isLoadingFinancials}
                    />
                </div>
                
                {/* Risk Analysis */}
                <div id="risk" className="scroll-mt-24">
                    <RiskAnalyzer 
                        analysis={currentRisk}
                        onAnalyze={handleAnalyzeRisk}
                        isLoading={isLoadingRisk}
                    />
                </div>

                {/* Strategy Map */}
                <div id="map" className="scroll-mt-24">
                    <StrategyMap 
                        data={currentStrategyMap}
                        onGenerate={handleGenerateMap}
                        isLoading={isLoadingMap}
                    />
                </div>

                {/* Visionary Canvas (Product Mockups) */}
                <ProductCanvas 
                    mockup={currentMockup}
                    onGenerate={handleGenerateMockup}
                    isLoading={isLoadingMockup}
                />
                
                {/* Pitch Architect */}
                <div id="pitch" className="scroll-mt-24">
                    <PitchArchitect 
                        pitch={currentPitch}
                        onGenerate={handleGeneratePitch}
                        isLoading={isLoadingPitch}
                    />
                </div>
                
                {/* Competitor Arena */}
                <div id="competitors" className="scroll-mt-24">
                    <CompetitorArena 
                        analysis={currentCompetitors}
                        onAnalyze={handleAnalyzeCompetitors}
                        isLoading={isLoadingCompetitors}
                    />
                </div>

                {/* Smart Insights Section (SWOT & Pivots) */}
                {currentInsights && (
                    <SmartInsights 
                        insights={currentInsights} 
                        onPivot={handlePivot} 
                    />
                )}

                <SearchResults results={currentSearchResults} trend={currentTrend} />
            </>
        )}

        {imageHistory.length > 1 && (
            <div className="max-w-7xl mx-auto mt-16 md:mt-24 border-t border-slate-200 dark:border-white/10 pt-12 transition-colors print:hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                        <History className="w-4 h-4" />
                        Strategy Archives
                    </h3>
                    <button 
                        onClick={handleClearHistory}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="w-3 h-3" /> Clear History
                    </button>
                </div>
                
                {/* Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {imageHistory.slice(1).map((img) => (
                        <div 
                            key={img.id} 
                            onClick={() => restoreImage(img)}
                            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all shadow-lg bg-white dark:bg-slate-900/50 backdrop-blur-sm"
                        >
                            <img src={img.data} alt={img.prompt} className="w-full aspect-video object-cover opacity-90 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-xs text-white font-bold truncate mb-1 font-display">{img.prompt}</p>
                                <div className="flex gap-2">
                                    {img.stage && <span className="text-[9px] text-cyan-100 uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-500/20">{img.stage}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>
    </div>
    )}
    </>
  );
};

export default App;
