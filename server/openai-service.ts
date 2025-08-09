import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  static async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
      });

      return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }

  static async* generateStreamingResponse(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
          // Add significant delay to make streaming clearly visible (500ms)
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('OpenAI Streaming API Error:', error);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }

  static async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Generate a short, descriptive title (max 6 words) for a chat conversation based on the user's first message. Focus on the main topic or intent."
          },
          {
            role: "user",
            content: firstMessage
          }
        ],
        max_tokens: 20,
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content?.trim() || 'New Chat';
    } catch (error) {
      console.error('OpenAI Title Generation Error:', error);
      return 'New Chat';
    }
  }
}