
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type AspectRatio = '16:9' | '9:16' | '1:1';

export type BusinessStage = 'Ideation' | 'MVP' | 'Growth' | 'Scale';

export type VisualStyle = 'Modern SaaS' | 'Tech Dark' | 'Whiteboard' | 'Corporate' | 'Vibrant Startup' | 'Data Professional';

export type BusinessFocus = 'Strategy' | 'Marketing' | 'Product' | 'Investors' | 'Operations' | 'Sales';

export interface GeneratedImage {
  id: string;
  data: string; // Base64 data URL
  prompt: string;
  timestamp: number;
  stage?: BusinessStage;
  style?: VisualStyle;
  focus?: BusinessFocus;
}

export interface SearchResultItem {
  title: string;
  url: string;
}

export interface TrendData {
  label: string;
  value: string;
  data: number[];
  direction: 'up' | 'down' | 'neutral';
}

export interface BusinessInsight {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pivots: string[];
}

export interface RiskAnalysis {
  fatalFlaws: string[];
  mitigations: string[];
  viabilityScore: number; // 0-100
}

export interface Advisor {
  role: 'CFO' | 'CMO' | 'CTO';
  name: string;
  avatarColor: string;
  advice: string;
  concern: string;
  verdict: 'Approve' | 'Reject' | 'Pivot';
}

export interface BoardMessage {
  role: 'User' | 'CFO' | 'CMO' | 'CTO' | 'System';
  name: string;
  text: string;
  timestamp: number;
}

export interface BoardMeeting {
  advisors: Advisor[];
  synthesis: string;
  chatHistory: BoardMessage[];
}

export interface ResearchResult {
  imagePrompt: string;
  facts: string[];
  searchResults: SearchResultItem[];
  insights: BusinessInsight;
  trend: TrendData;
}

// Strategy Map Types
export type StrategyNodeCategory = 'Market' | 'Product' | 'Operation' | 'Finance' | 'Risk';

export interface StrategyNode {
  id: string;
  label: string;
  category: StrategyNodeCategory;
  x: number;
  y: number;
}

export interface StrategyEdge {
  from: string;
  to: string;
  label?: string;
}

export interface StrategyMapData {
  nodes: StrategyNode[];
  edges: StrategyEdge[];
}

// Pitch Architect Types
export interface PitchKit {
  oneLiner: string;
  elevatorPitch: string;
  emailTemplate: string;
  socialPost: string;
  valueProposition: string;
}

// Competitor Arena Types
export interface Competitor {
  name: string;
  description: string;
  theirEdge: string;
  yourEdge: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketGap: string;
}

// Financial Types
export interface FinancialModel {
  pricingModel: string; // e.g., "Subscription", "One-time"
  currency: string;
  metrics: {
    price: number;
    cac: number; // Cost acquisition
    cogs: number; // Cost of goods
    users: number; // Projected users month 12
  };
  insight: string;
}

// Product Mockup Types
export type MockupType = 'Mobile App' | 'SaaS Dashboard' | 'Physical Product' | 'Marketing Website';

export interface ProductMockup {
  type: MockupType;
  imageData: string;
  caption: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
