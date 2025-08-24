import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

// Types for AI responses and routing
export interface AIProvider {
  name: 'openai' | 'perplexity' | 'gemini';
  confidence: number;
  reasoning: string;
}

export interface AIResponse {
  content: string;
  provider: string;
  metadata?: {
    sources?: string[];
    citations?: string[];
    confidence?: number;
    reasoning?: string;
  };
}

export interface HybridResponse {
  content: string;
  providers: AIProvider[];
  strategy: 'single' | 'hybrid' | 'enhanced';
  reasoning: string;
  sources?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class HybridAIService {
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Analyze user question and determine optimal AI strategy
   */
  private analyzeQuestion(userMessage: string): {
    complexity: 'simple' | 'moderate' | 'complex';
    requiresResearch: boolean;
    requiresTrending: boolean;
    requiresDeepAnalysis: boolean;
    recommendedStrategy: 'single' | 'hybrid' | 'enhanced';
    primaryProvider: 'openai' | 'perplexity' | 'gemini';
    reasoning: string;
  } {
    const message = userMessage.toLowerCase();
    
    // Trending and research indicators
    const trendingKeywords = [
      'trending', 'latest', 'current', 'recent', 'new', 'today', 'this week',
      'viral', 'popular', 'hot topic', 'breaking', 'news', 'update'
    ];
    
    const researchKeywords = [
      'research', 'study', 'analysis', 'compare', 'statistics', 'data',
      'survey', 'report', 'findings', 'evidence', 'facts', 'sources'
    ];
    
    const complexKeywords = [
      'strategy', 'comprehensive', 'detailed', 'step-by-step', 'complete guide',
      'advanced', 'professional', 'enterprise', 'scale', 'framework'
    ];
    
    const requiresResearch = researchKeywords.some(keyword => message.includes(keyword));
    const requiresTrending = trendingKeywords.some(keyword => message.includes(keyword));
    const requiresDeepAnalysis = complexKeywords.some(keyword => message.includes(keyword));
    
    // Question complexity analysis
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    if (message.length > 100 || requiresDeepAnalysis) complexity = 'complex';
    else if (message.length > 50 || requiresResearch || requiresTrending) complexity = 'moderate';
    
    // Strategy determination
    let recommendedStrategy: 'single' | 'hybrid' | 'enhanced' = 'single';
    let primaryProvider: 'openai' | 'perplexity' | 'gemini' = 'openai';
    let reasoning = '';
    
    if (requiresTrending && requiresDeepAnalysis) {
      recommendedStrategy = 'hybrid';
      primaryProvider = 'perplexity';
      reasoning = 'Question requires trending data research + comprehensive analysis';
    } else if (requiresTrending) {
      recommendedStrategy = 'single';
      primaryProvider = 'perplexity';
      reasoning = 'Question asks for trending/current information';
    } else if (complexity === 'complex' && requiresResearch) {
      recommendedStrategy = 'enhanced';
      primaryProvider = 'openai';
      reasoning = 'Complex question requiring detailed research and analysis';
    } else if (complexity === 'complex') {
      recommendedStrategy = 'single';
      primaryProvider = 'openai';
      reasoning = 'Complex question best handled by advanced reasoning';
    } else if (message.includes('creative') || message.includes('content ideas')) {
      recommendedStrategy = 'single';
      primaryProvider = 'gemini';
      reasoning = 'Creative content generation suited for Gemini';
    } else {
      recommendedStrategy = 'single';
      primaryProvider = 'openai';
      reasoning = 'Standard question well-suited for OpenAI';
    }
    
    return {
      complexity,
      requiresResearch,
      requiresTrending,
      requiresDeepAnalysis,
      recommendedStrategy,
      primaryProvider,
      reasoning
    };
  }

  /**
   * Gemini Streaming Response
   */
  async* generateGeminiStreamingResponse(userMessage: string): AsyncGenerator<string, void, unknown> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are VeeGPT, an AI assistant specifically designed to help content creators and social media professionals. You specialize in:

1. Content Strategy & Planning
2. Social Media Marketing  
3. Video Content Creation
4. Brand Building
5. Audience Engagement
6. Content Optimization
7. Analytics & Insights
8. Platform-specific advice (Instagram, YouTube, TikTok, etc.)

Always provide practical, actionable advice tailored to content creation and social media growth. Be conversational, helpful, and specific in your recommendations.

User question: ${userMessage}`;

      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error('Gemini streaming error:', error);
      yield 'I apologize, but I encountered an error generating a response. Please try again.';
    }
  }

  /**
   * OpenAI Streaming Response
   */
  async* generateOpenAIStreamingResponse(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are VeeGPT, an AI assistant specifically designed to help content creators and social media professionals. You specialize in:

1. Content Strategy & Planning
2. Social Media Marketing
3. Video Content Creation
4. Brand Building
5. Audience Engagement
6. Content Optimization
7. Analytics & Insights
8. Platform-specific advice (Instagram, YouTube, TikTok, etc.)

Always provide practical, actionable advice tailored to content creation and social media growth. Be conversational, helpful, and specific in your recommendations.`
          },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      yield 'I apologize, but I encountered an error generating a response. Please try again.';
    }
  }

  /**
   * Perplexity API Call (Research & Trending Data)
   */
  private async getPerplexityResponse(userMessage: string): Promise<AIResponse> {
    console.log('[PERPLEXITY] Starting API call for message:', userMessage.substring(0, 50) + '...');
    console.log('[PERPLEXITY] API Key configured:', !!process.env.PERPLEXITY_API_KEY);
    console.log('[PERPLEXITY] API Key length:', process.env.PERPLEXITY_API_KEY?.length || 0);
    
    try {
      const requestBody = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a research-focused AI assistant specializing in current trends, data, and up-to-date information for content creators and social media professionals. Provide well-sourced, current information with citations when possible.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false
      };
      
      console.log('[PERPLEXITY] Making fetch request to Perplexity API...');
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('[PERPLEXITY] Response status:', response.status);
      console.log('[PERPLEXITY] Response statusText:', response.statusText);
      console.log('[PERPLEXITY] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PERPLEXITY] API error response:', errorText.substring(0, 200) + '...');
        
        // Provide clean error handling without exposing HTML error pages
        if (response.status === 401) {
          console.error('[PERPLEXITY] Authentication failed - API key may be invalid or expired');
          throw new Error('External research data temporarily unavailable due to authentication issues.');
        } else if (response.status === 429) {
          console.error('[PERPLEXITY] Rate limit exceeded');
          throw new Error('External research data temporarily unavailable due to rate limiting.');
        } else if (response.status >= 500) {
          console.error('[PERPLEXITY] Server error');
          throw new Error('External research service temporarily unavailable.');
        } else {
          throw new Error('Unable to access current research data at the moment.');
        }
      }

      const data = await response.json() as any;
      console.log('[PERPLEXITY] Response data received, keys:', Object.keys(data));
      console.log('[PERPLEXITY] Full response:', JSON.stringify(data, null, 2));
      
      const content = data.choices?.[0]?.message?.content;
      console.log('[PERPLEXITY] Extracted content:', content ? content.substring(0, 100) + '...' : 'No content');
      
      return {
        content: content || 'Unable to fetch research data from Perplexity.',
        provider: 'perplexity',
        metadata: {
          sources: data.citations || [],
          confidence: 0.9,
          reasoning: 'Perplexity research with current data'
        }
      };
    } catch (error: any) {
      console.error('[PERPLEXITY] API error occurred:', error);
      console.error('[PERPLEXITY] Error name:', error.name);
      console.error('[PERPLEXITY] Error message:', error.message);
      console.error('[PERPLEXITY] Error stack:', error.stack);
      
      return {
        content: `I encountered an issue accessing current research data: ${error.message}. Please try again.`,
        provider: 'perplexity',
        metadata: { confidence: 0, reasoning: 'API error: ' + error.message }
      };
    }
  }

  /**
   * Gemini Response (Creative & Content Generation)
   */
  private async getGeminiResponse(userMessage: string): Promise<AIResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const prompt = `You are VeeGPT, a creative AI assistant specializing in content creation, social media strategy, and innovative marketing ideas. 

User Question: ${userMessage}

Provide creative, actionable insights focused on content creation and social media growth.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return {
        content: text,
        provider: 'gemini',
        metadata: {
          confidence: 0.85,
          reasoning: 'Gemini creative content generation'
        }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        content: 'I encountered an issue with creative content generation. Please try again.',
        provider: 'gemini',
        metadata: { confidence: 0, reasoning: 'API error' }
      };
    }
  }

  /**
   * OpenAI Response (Non-streaming for hybrid combinations)
   */
  private async getOpenAIResponse(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are VeeGPT, an AI assistant specifically designed to help content creators and social media professionals. Provide practical, actionable advice.`
          },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return {
        content: response.choices[0]?.message?.content || 'Unable to generate response.',
        provider: 'openai',
        metadata: {
          confidence: 0.9,
          reasoning: 'OpenAI advanced reasoning'
        }
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        content: 'I encountered an issue generating a response. Please try again.',
        provider: 'openai',
        metadata: { confidence: 0, reasoning: 'API error' }
      };
    }
  }

  /**
   * Combine multiple AI responses intelligently
   */
  private combineResponses(responses: AIResponse[], strategy: string): string {
    if (responses.length === 1) {
      return responses[0].content;
    }

    // For hybrid responses, intelligently combine insights
    const perplexityResponse = responses.find(r => r.provider === 'perplexity');
    const openaiResponse = responses.find(r => r.provider === 'openai');
    const geminiResponse = responses.find(r => r.provider === 'gemini');

    let combinedContent = '';

    if (perplexityResponse && perplexityResponse.metadata?.sources?.length) {
      combinedContent += `**Current Research & Trends:**\n${perplexityResponse.content}\n\n`;
      
      if (perplexityResponse.metadata.sources.length > 0) {
        combinedContent += `**Sources:**\n${perplexityResponse.metadata.sources.slice(0, 3).map(source => `• ${source}`).join('\n')}\n\n`;
      }
    }

    if (openaiResponse) {
      combinedContent += `**Strategic Analysis:**\n${openaiResponse.content}\n\n`;
    }

    if (geminiResponse) {
      combinedContent += `**Creative Insights:**\n${geminiResponse.content}`;
    }

    return combinedContent.trim();
  }

  /**
   * Main hybrid AI generation with streaming and status updates
   */
  async* generateHybridStreamingResponse(messages: ChatMessage[], statusCallback?: (status: string) => void): AsyncGenerator<string, void, unknown> {
    try {
      const userMessage = messages[messages.length - 1]?.content || '';
      
      console.log(`[HYBRID AI] Processing message: ${userMessage.substring(0, 100)}...`);
      
      // Analyze the question first
      const analysis = this.analyzeQuestion(userMessage);
      console.log(`[HYBRID AI] Analysis result:`, analysis);
      
      // Show dynamic status based on actual analysis
      const questionType = analysis.requiresTrending ? 'trending research query' : 
                          analysis.requiresDeepAnalysis ? 'strategic analysis request' : 
                          userMessage.toLowerCase().includes('creative') ? 'creative content request' : 
                          'general assistance query';
      
      statusCallback?.(`🧠 Detected ${questionType} (${analysis.complexity} complexity) → Routing to ${analysis.primaryProvider.toUpperCase()} AI...`);
      
      // Route based on analysis with contextual status messages
      if (analysis.requiresTrending) {
        console.log('[HYBRID AI] Routing to Perplexity for trending data');
        statusCallback?.(`🔍 Perplexity AI searching real-time data for: "${userMessage.length > 60 ? userMessage.substring(0, 60) + '...' : userMessage}"`);
        
        try {
          const response = await this.getPerplexityResponse(userMessage);
          const words = response.content.split(' ');
          for (const word of words) {
            yield word + ' ';
          }
        } catch (error) {
          console.log('[HYBRID AI] Perplexity failed, falling back to OpenAI');
          statusCallback?.(`⚡ External research unavailable → OpenAI GPT-4o providing comprehensive analysis...`);
          yield* this.generateOpenAIStreamingResponse(messages);
        }
        return;
      }
      
      // Default to OpenAI with contextual status
      console.log('[HYBRID AI] Routing to OpenAI for comprehensive response');
      const taskDescription = analysis.requiresDeepAnalysis ? 'strategic planning and detailed analysis' :
                             userMessage.toLowerCase().includes('marketing') ? 'marketing strategy development' :
                             userMessage.toLowerCase().includes('campaign') ? 'campaign planning and execution' :
                             userMessage.toLowerCase().includes('content') ? 'content strategy optimization' :
                             'comprehensive assistance';
      
      statusCallback?.(`🚀 OpenAI GPT-4o processing ${taskDescription} for your request...`);
      yield* this.generateOpenAIStreamingResponse(messages);
      return;

      
    } catch (error) {
      console.error('[HYBRID AI] Error:', error);
      statusCallback?.('❌ Error occurred - attempting fallback response...');
      yield 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  /**
   * Generate chat title using OpenAI
   */
  async generateChatTitle(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Generate a concise, descriptive title (max 60 characters) for this chat conversation based on the user's first message. Focus on the main topic or question."
          },
          {
            role: "user", 
            content: `Generate a title for this message: "${content}"`
          }
        ],
        max_tokens: 20,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content?.trim() || 'New Chat';
    } catch (error) {
      console.error('Error generating chat title:', error);
      return 'New Chat';
    }
  }
}