
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { BusinessStage, VisualStyle, BusinessFocus, ResearchResult, SearchResultItem, BusinessInsight, RiskAnalysis, BoardMeeting, StrategyMapData, StrategyNode, PitchKit, CompetitorAnalysis, FinancialModel, BoardMessage, ProductMockup, MockupType } from "../types";

// Create a fresh client for every request to ensure the latest API key from process.env.API_KEY is used
const getAi = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Updated to use 'gemini-3-pro-image-preview' for all operations including search grounding and image generation
const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const EDIT_MODEL = 'gemini-3-pro-image-preview';
const FAST_MODEL = 'gemini-2.5-flash';
const AUDIO_MODEL = 'gemini-2.5-flash-preview-tts';

const getStageInstruction = (stage: BusinessStage): string => {
  switch (stage) {
    case 'Ideation':
      return "Context: Early stage startup ideation. Focus on problem-solution fit, conceptual models, and vision. Style: Rough, creative, blue-sky thinking.";
    case 'MVP':
      return "Context: Minimum Viable Product. Focus on core features, user flows, and lean metrics. Style: Practical, clean, functional.";
    case 'Growth':
      return "Context: Growth stage business. Focus on user acquisition, retention, and market expansion. Style: Data-driven, energetic, upward trending.";
    case 'Scale':
      return "Context: Scaling Enterprise. Focus on organizational structure, global reach, and revenue operations. Style: Polished, authoritative, established.";
    default:
      return "Context: General Business. Style: Professional.";
  }
};

const getStyleInstruction = (style: VisualStyle): string => {
  switch (style) {
    case 'Modern SaaS': return "Aesthetic: Stripe/Airbnb Style. Ultra-clean, ample whitespace, soft shadows, vibrant accent colors (blurple/indigo), rounded UI elements.";
    case 'Tech Dark': return "Aesthetic: Dark Mode Tech. Deep slate/black backgrounds, glowing neon accents (cyan/purple), monospaced fonts, cyber-security vibe.";
    case 'Whiteboard': return "Aesthetic: Hand-drawn Strategy. Marker style lines on a whiteboard background, sticky note elements, arrows, rough sketches, brainstorming vibe.";
    case 'Corporate': return "Aesthetic: Blue-Chip Professional. Trustworthy blue/grey palette, stock photography integration, clean grids, serif headers.";
    case 'Vibrant Startup': return "Aesthetic: Notion/Gumroad Style. Flat illustrations, pastel colors, bold typography, playful shapes, friendly and accessible.";
    case 'Data Professional': return "Aesthetic: Financial Report. High-density charts, precise data visualization, muted professional colors, Tufte-style minimalism.";
    default: return "Aesthetic: Professional Business Illustration. Clean and effective.";
  }
};

const getFocusInstruction = (focus: BusinessFocus): string => {
    switch (focus) {
        case 'Strategy': return "Goal: Strategic Planning. Highlight roadmaps, SWOT analysis, and competitive landscape.";
        case 'Marketing': return "Goal: Marketing & Sales. Highlight customer personas, funnels, conversion rates, and brand positioning.";
        case 'Product': return "Goal: Product Development. Highlight features, tech stack, user journey, and architecture.";
        case 'Investors': return "Goal: Pitch Deck. Highlight market size (TAM/SAM/SOM), revenue potential, and team structure. Make it impressive for VCs.";
        case 'Operations': return "Goal: Business Operations. Highlight workflows, logistics, efficiency, and internal processes.";
        case 'Sales': return "Goal: Revenue Generation. Highlight pricing models, sales cycles, and closing strategies.";
        default: return "Goal: General Business Overview.";
    }
}

// New Smart Feature: Optimizes the user's simple input into a robust prompt
export const optimizePrompt = async (input: string, stage: BusinessStage): Promise<string> => {
  if (!input || input.length < 3) return input;

  const prompt = `
    You are a startup mentor. Rewrite the following business idea into a concise but specific 2-sentence description suitable for generating a strategic visualization.
    User Input: "${input}"
    Business Stage: ${stage}
    
    Make it sound professional and visionary. Do not add quotation marks.
  `;

  const response = await getAi().models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text?.trim() || input;
};

export const researchTopicForPrompt = async (
  topic: string, 
  stage: BusinessStage, 
  style: VisualStyle,
  focus: BusinessFocus
): Promise<ResearchResult> => {
  
  const stageInstr = getStageInstruction(stage);
  const styleInstr = getStyleInstruction(style);
  const focusInstr = getFocusInstruction(focus);

  const systemPrompt = `
    You are an expert business consultant and visual strategist for solo founders.
    Your goal is to research the topic: "${topic}" and create a plan for a business infographic.
    
    **IMPORTANT: Use the Google Search tool to find the most accurate, up-to-date market data and trends about this topic.**
    
    ${stageInstr}
    ${styleInstr}
    ${focusInstr}
    
    Please provide your response in the following format EXACTLY:
    
    FACTS:
    - [Key Metric/Fact 1]
    - [Key Metric/Fact 2]
    - [Key Metric/Fact 3]
    
    IMAGE_PROMPT:
    [A highly detailed image generation prompt describing the visual composition, colors, and layout for the infographic. tailored to the aesthetic. Do not include citations in the prompt.]

    INSIGHTS_JSON:
    [A JSON object containing a SWOT analysis, 'pivots' (short alternative business ideas), and 'trend' data (a sparkline representing market interest or growth over time).]
  `;

  const response = await getAi().models.generateContent({
    model: TEXT_MODEL,
    contents: systemPrompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          facts: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING },
          insights: {
            type: Type.OBJECT,
            properties: {
              swot: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
              },
              pivots: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          trend: {
            type: Type.OBJECT,
            description: "A visual representation of market trend/interest over time",
            properties: {
              label: { type: Type.STRING, description: "Label for the trend (e.g. '5-Year Forecast', 'Search Interest')"},
              value: { type: Type.STRING, description: "The aggregate value or growth (e.g. '+24% CAGR', 'High Demand')"},
              data: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Array of 7 integers from 0-100 representing the sparkline points"},
              direction: { type: Type.STRING, enum: ['up', 'down', 'neutral'], description: "Overall trend direction"}
            }
          }
        }
      }
    },
  });

  // With Schema, we get a JSON object back directly
  const result = JSON.parse(response.text || "{}");
  
  const facts = result.facts || [];
  const imagePrompt = result.imagePrompt || `Create a detailed business infographic about ${topic}. ${stageInstr} ${styleInstr} ${focusInstr}`;
  const insights = result.insights || { swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }, pivots: [] };
  const trend = result.trend || { label: 'Market Activity', value: 'Stable', data: [40, 45, 50, 55, 50, 45, 40], direction: 'neutral' };

  // Extract Grounding (Search Results)
  const searchResults: SearchResultItem[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  if (chunks) {
    chunks.forEach(chunk => {
      if (chunk.web?.uri && chunk.web?.title) {
        searchResults.push({
          title: chunk.web.title,
          url: chunk.web.uri
        });
      }
    });
  }

  // Remove duplicates based on URL
  const uniqueResults = Array.from(new Map(searchResults.map(item => [item.url, item])).values());

  return {
    imagePrompt: imagePrompt,
    facts: facts.slice(0, 5),
    searchResults: uniqueResults,
    insights: insights,
    trend: trend
  };
};

export const generateRiskAnalysis = async (
  topic: string, 
  stage: BusinessStage, 
  focus: BusinessFocus
): Promise<RiskAnalysis> => {
  const prompt = `
    Act as a skeptical Venture Capitalist and Risk Officer.
    Critically analyze this business concept for a solo founder.
    
    Topic: ${topic}
    Stage: ${stage}
    Focus: ${focus}
    
    Identify 3 "Fatal Flaws" (Why this might fail) and 3 "Mitigation Strategies" (How to fix it).
    Also provide a "Viability Score" from 0 to 100.
  `;

  const response = await getAi().models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                fatalFlaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                mitigations: { type: Type.ARRAY, items: { type: Type.STRING } },
                viabilityScore: { type: Type.INTEGER }
            }
        }
    }
  });
  
  const result = JSON.parse(response.text || "{}");
  return result as RiskAnalysis;
};

export const generateBoardMeeting = async (topic: string, stage: BusinessStage): Promise<BoardMeeting> => {
    const prompt = `
      You are simulating a Board of Directors meeting for a solo founder.
      The founder's idea: "${topic}" (Stage: ${stage}).
      
      Create 3 distinct personas who are arguing about this idea from their specific domain of expertise.
      They should have CONFLICTING viewpoints and actively critique each other's perspectives to simulate a real debate.
      
      1. The CFO (Marcus): Frugal, risk-averse, obsessed with margins and burn rate. Skeptical of the CMO's spending.
      2. The CMO (Sarah): Viral-obsessed, focuses on brand, community, and hype. Optimistic but frustrated by the CFO's constraints.
      3. The CTO (Alex): Pragmatic, focuses on build time, technical feasibility, and scalability. Logical and focused on execution.
      
      Generate their specific advice, their biggest concern, and their vote (Approve/Reject/Pivot).
      
      Return a hex color code for 'avatarColor' that matches their vibe (e.g., CFO=Green, CMO=Pink, CTO=Blue).
      Finally, provide a 1-sentence synthesis of the conflict.
    `;
  
    const response = await getAi().models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advisors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, enum: ['CFO', 'CMO', 'CTO'] },
                  name: { type: Type.STRING },
                  avatarColor: { type: Type.STRING, description: "A hex color code matching the persona" },
                  advice: { type: Type.STRING },
                  concern: { type: Type.STRING },
                  verdict: { type: Type.STRING, enum: ['Approve', 'Reject', 'Pivot'] }
                }
              }
            },
            synthesis: { type: Type.STRING }
          }
        }
      }
    });
  
    const result = JSON.parse(response.text || "{}");
    return { ...result, chatHistory: [] } as BoardMeeting;
  };

  export const askBoardQuestion = async (
    currentMeeting: BoardMeeting, 
    question: string
  ): Promise<BoardMessage[]> => {
    const prompt = `
      Context: A board meeting between a CFO (Marcus), CMO (Sarah), and CTO (Alex).
      Current Board State: ${JSON.stringify(currentMeeting.advisors.map(a => ({ role: a.role, stance: a.verdict })))}
      
      The Founder (User) asks: "${question}"
      
      Based on the question, choose ONE or TWO advisors who would feel most strongly about this to respond.
      They should respond IN CHARACTER, referencing their previous stance or arguing with the other advisors if relevant.
      Keep responses short and conversational (under 30 words).
      
      Output JSON format: An array of messages.
    `;

    const response = await getAi().models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            messages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, enum: ['CFO', 'CMO', 'CTO'] },
                  name: { type: Type.STRING },
                  text: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const newMessages: BoardMessage[] = (result.messages || []).map((m: any) => ({
      ...m,
      timestamp: Date.now()
    }));
    return newMessages;
  };

export const generateStrategyMap = async (topic: string, stage: BusinessStage): Promise<StrategyMapData> => {
  const prompt = `
    Analyze the business topic: "${topic}" (Stage: ${stage}).
    Deconstruct this business into a System Map of 6 to 10 key interconnected components.
    
    Categorize each node into:
    - 'Operation' (Internal processes, logistics)
    - 'Product' (The offering, features)
    - 'Market' (Customers, channels, competitors)
    - 'Finance' (Revenue, costs, funding)
    - 'Risk' (Regulations, dependencies)
    
    Define directional edges (connections) between them to show value flow or dependency.
    Example: "Product" -> "Market" (Label: "Distribution").
  `;

  const response = await getAi().models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['Operation', 'Product', 'Market', 'Finance', 'Risk'] }
              }
            }
          },
          edges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                from: { type: Type.STRING },
                to: { type: Type.STRING },
                label: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "{}");
  
  // Post-processing: Assign initial X/Y coordinates based on category to create a logical layout
  // Canvas size approx 800x600
  const nodes: StrategyNode[] = (rawData.nodes || []).map((node: any, index: number) => {
    let x = 400;
    let y = 300;
    
    // Add randomness to prevent overlap
    const rand = () => Math.random() * 100 - 50;

    switch (node.category) {
      case 'Operation': // Left
        x = 150 + rand();
        y = 300 + (index % 2 === 0 ? -100 : 100) + rand();
        break;
      case 'Product': // Center
        x = 400 + rand();
        y = 300 + rand();
        break;
      case 'Market': // Right
        x = 650 + rand();
        y = 300 + (index % 2 === 0 ? -100 : 100) + rand();
        break;
      case 'Finance': // Bottom
        x = 400 + (index % 2 === 0 ? -150 : 150) + rand();
        y = 500 + rand();
        break;
      case 'Risk': // Top
        x = 400 + (index % 2 === 0 ? -150 : 150) + rand();
        y = 100 + rand();
        break;
    }

    return { ...node, x, y };
  });

  return { nodes, edges: rawData.edges || [] };
};

export const generatePitchKit = async (topic: string, stage: BusinessStage, focus: BusinessFocus): Promise<PitchKit> => {
  const stageInstr = getStageInstruction(stage);
  const focusInstr = getFocusInstruction(focus);

  const prompt = `
    You are a professional copywriter for high-growth startups.
    Generate a "Pitch Kit" for the following business:
    Topic: "${topic}"
    
    CONFIGURATION:
    Stage: ${stage} (${stageInstr})
    Focus: ${focus} (${focusInstr})
    
    Create 5 distinct assets tailored specifically to this stage and focus:
    1. One-Liner (Hook): A compelling H1 headline for a landing page.
    2. Value Proposition: A concise 1-sentence statement of the core benefit.
    3. Elevator Pitch: A 30-second conversational script (approx 60-80 words) using the PAS framework (Problem-Agitate-Solution).
    4. Cold Email Template: A short, punchy email to an investor/partner.
    5. Social Post: A viral-style tweet/LinkedIn post announcing the concept.
    
    Tone: Professional, persuasive, and tailored to the '${stage}' stage.
  `;

  const response = await getAi().models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          oneLiner: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          elevatorPitch: { type: Type.STRING },
          emailTemplate: { type: Type.STRING },
          socialPost: { type: Type.STRING }
        }
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as PitchKit;
};

export const analyzeCompetitors = async (topic: string): Promise<CompetitorAnalysis> => {
    const prompt = `
      Research real-world competitors for a business described as: "${topic}".
      Identify 3 specific, real companies that are direct competitors.
      
      For each competitor:
      1. Name & Description.
      2. "Their Edge" (What they do best).
      3. "Your Edge" (How a new solo founder could beat them - e.g. niche focus, price, speed, personalization).
      
      Also provide a "Market Gap" statement summarizing the opportunity.
      
      Use Google Search to find actual companies.
    `;
  
    const response = await getAi().models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  theirEdge: { type: Type.STRING },
                  yourEdge: { type: Type.STRING }
                }
              }
            },
            marketGap: { type: Type.STRING }
          }
        }
      }
    });
  
    const result = JSON.parse(response.text || "{}");
    return result as CompetitorAnalysis;
  };

export const generateFinancialModel = async (topic: string, stage: BusinessStage): Promise<FinancialModel> => {
  const prompt = `
    Create a "Napkin Math" financial estimation for this business idea: "${topic}" (Stage: ${stage}).
    Estimate realistic starting unit economics.
    
    Provide:
    1. Pricing Model (e.g., Subscription, One-time Purchase, Freemium).
    2. Estimated Price (Monthly or per unit).
    3. Estimated CAC (Cost to Acquire a Customer).
    4. Estimated COGS (Cost of Goods Sold / Server costs per user).
    5. Projected Users (Month 12 realistic target for a solo founder).
    6. A short 1-sentence insight about the economics (e.g., "High margin but high CAC").
  `;

  const response = await getAi().models.generateContent({
    model: FAST_MODEL,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pricingModel: { type: Type.STRING },
          currency: { type: Type.STRING, enum: ['$', '€', '£'] },
          metrics: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER },
              cac: { type: Type.NUMBER },
              cogs: { type: Type.NUMBER },
              users: { type: Type.NUMBER }
            }
          },
          insight: { type: Type.STRING }
        }
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as FinancialModel;
};

// Generates a Product Mockup (Image)
export const generateProductMockup = async (
  topic: string, 
  mockupType: MockupType, 
  style: VisualStyle
): Promise<ProductMockup> => {
  
  let typePrompt = "";
  switch(mockupType) {
      case 'Mobile App': typePrompt = "High fidelity UI design of a modern mobile app interface. Isometric perspective showing 3 floating iPhone 15 screens. Clean, professional, Dribbble trending style."; break;
      case 'SaaS Dashboard': typePrompt = "Photorealistic mockup of a MacBook Pro displaying a complex SaaS analytics dashboard. Dark glassmorphism UI, detailed charts, data tables. Professional studio lighting."; break;
      case 'Physical Product': typePrompt = "Modern minimalist product packaging design. Photorealistic 3D render of a box or container on a podium. Studio lighting, soft shadows."; break;
      case 'Marketing Website': typePrompt = "Full page web design layout for a high-converting landing page. Hero section with bold typography and CTA. Clean, modern aesthetic."; break;
  }

  const styleInstr = getStyleInstruction(style);
  const prompt = `
    Create a stunning, professional product visualization for a business about: "${topic}".
    Type: ${typePrompt}
    ${styleInstr}
    
    Ensure high resolution, perfect perspective, and no garbled text. Focus on visual impact and brand identity.
  `;

  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return {
        type: mockupType,
        imageData: `data:image/png;base64,${part.inlineData.data}`,
        caption: `AI Generated ${mockupType} for ${topic}`
    };
  }
  throw new Error("Failed to generate mockup");
};


export const generateInfographicImage = async (prompt: string): Promise<string> => {
  // Use Gemini 3 Pro Image Preview for generation
  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    }
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to generate image");
};

export const editInfographicImage = async (currentImageBase64: string, editInstruction: string): Promise<string> => {
  const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  
  const response = await getAi().models.generateContent({
    model: EDIT_MODEL,
    contents: {
      parts: [
         { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
         { text: editInstruction }
      ]
    },
    config: {
      responseModalities: [Modality.IMAGE],
    }
  });
  
   const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Failed to edit image");
};

export const generateAudioBrief = async (topic: string, insights: BusinessInsight, facts: string[]): Promise<string> => {
    const context = `
        Topic: ${topic}
        Key Facts: ${facts.join(', ')}
        Strengths: ${insights.swot.strengths.slice(0,2).join(', ')}
        Opportunities: ${insights.swot.opportunities.slice(0,2).join(', ')}
        Pivots: ${insights.pivots.slice(0,1).join(', ')}
    `;

    const prompt = `
        You are a senior business analyst briefing a solo founder. 
        Give a high-energy, 30-second executive summary of the following business analysis. 
        Be encouraging but realistic. Speak directly to the founder.
        
        Data: ${context}
    `;

    const response = await getAi().models.generateContent({
        model: AUDIO_MODEL,
        contents: { parts: [{ text: prompt }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
    }
    throw new Error("Failed to generate audio");
}
