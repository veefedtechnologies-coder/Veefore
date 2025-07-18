/**
 * Shared OpenAI Client Configuration
 * Provides a centralized way to access OpenAI client with proper error handling
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

/**
 * Get OpenAI client instance - creates one if not exists
 */
export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/**
 * Check if OpenAI is available
 */
export const isOpenAIAvailable = (): boolean => {
  return !!process.env.OPENAI_API_KEY;
};

/**
 * Reset OpenAI client (useful for testing or config changes)
 */
export const resetOpenAIClient = (): void => {
  openaiClient = null;
};

/**
 * Enhanced OpenAI Service for Video Script Generation
 */
class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = getOpenAIClient();
  }

  /**
   * Generate video script with scenes using OpenAI GPT-4
   */
  async generateVideoScript(params: {
    prompt: string;
    duration: number;
    visualStyle: string;
    tone: string;
  }) {
    const { prompt, duration, visualStyle, tone } = params;

    try {
      console.log('[OPENAI] Generating video script with GPT-4...');

      const systemPrompt = `You are an expert video scriptwriter specializing in creating engaging, structured video scripts for AI video generation.

Your task is to create a professional video script with detailed scene breakdowns that will be used to generate images and narration for an AI video.

Guidelines:
- Total video duration: ${duration} seconds
- Visual style: ${visualStyle}
- Tone: ${tone}
- Break the script into logical scenes (3-8 scenes depending on duration)
- Each scene should be 3-8 seconds long
- Provide clear visual descriptions for AI image generation
- Write compelling narration that matches the tone
- Include emotional context for each scene

Respond with JSON in this exact format:
{
  "title": "Generated video title",
  "totalDuration": ${duration},
  "scenes": [
    {
      "id": "scene_1",
      "duration": 5,
      "narration": "Clear, engaging narration text for this scene",
      "description": "Detailed visual description for AI image generation (photorealistic, cinematic, etc.)",
      "emotion": "calm/energetic/dramatic/inspiring/etc",
      "visualElements": ["element1", "element2", "element3"]
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a professional video script for: ${prompt}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 2000
      });

      const script = JSON.parse(response.choices[0].message.content || '{}');
      
      // Add unique IDs to scenes
      script.scenes = script.scenes.map((scene: any, index: number) => ({
        ...scene,
        id: scene.id || `scene_${index + 1}`
      }));

      console.log('[OPENAI] Script generated successfully:', script.title);
      return script;

    } catch (error) {
      console.error('[OPENAI] Script generation error:', error);
      
      // Fallback to mock script for testing when OpenAI fails
      console.log('[OPENAI] Using fallback mock script for testing');
      return this.generateMockScript(prompt, duration, visualStyle, tone);
    }
  }

  /**
   * Generate a mock script for testing when OpenAI fails
   */
  private generateMockScript(prompt: string, duration: number, visualStyle: string, tone: string) {
    const scenesCount = Math.min(Math.max(Math.ceil(duration / 5), 3), 8); // 3-8 scenes
    const sceneLength = Math.floor(duration / scenesCount);
    
    const scenes = [];
    for (let i = 0; i < scenesCount; i++) {
      scenes.push({
        id: `scene_${i + 1}`,
        duration: sceneLength,
        narration: `Scene ${i + 1}: This is a ${tone} segment about ${prompt}. The ${visualStyle} style creates engaging content that captures the viewer's attention and delivers the message effectively.`,
        voiceover: `Scene ${i + 1}: This is a ${tone} segment about ${prompt}. The ${visualStyle} style creates engaging content that captures the viewer's attention and delivers the message effectively.`,
        description: `${visualStyle} cinematography showing ${prompt} - Scene ${i + 1}. High quality, professional production with excellent lighting and composition.`,
        visualStyle: visualStyle,
        emotion: i % 3 === 0 ? 'calm' : i % 3 === 1 ? 'energetic' : 'inspiring',
        visualElements: ['cinematic lighting', 'professional composition', 'high quality', `${visualStyle} aesthetic`]
      });
    }

    // Generate a proper title based on the prompt
    const capitalizedPrompt = prompt.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return {
      title: `${capitalizedPrompt}: A ${tone.charAt(0).toUpperCase() + tone.slice(1)} Journey`,
      totalDuration: duration,
      scenes: scenes,
      description: `A ${duration}-second ${tone} video about ${prompt} featuring ${visualStyle} cinematography and professional narration.`,
      style: visualStyle,
      tone: tone,
      hook: `Get ready to discover the fascinating world of ${prompt}. This ${tone} journey will captivate your audience from the very first second.`,
      callToAction: `Like and subscribe for more amazing content about ${prompt}. What did you think of this ${tone} approach? Let us know in the comments below!`
    };
  }

  /**
   * Regenerate a specific scene in the script
   */
  async regenerateScene(params: {
    originalPrompt: string;
    sceneId: string;
    visualStyle: string;
    tone: string;
    currentScript: any;
  }) {
    const { originalPrompt, sceneId, visualStyle, tone, currentScript } = params;

    try {
      console.log('[OPENAI] Regenerating scene:', sceneId);

      const sceneIndex = currentScript.scenes.findIndex((scene: any) => scene.id === sceneId);
      if (sceneIndex === -1) {
        throw new Error('Scene not found');
      }

      const currentScene = currentScript.scenes[sceneIndex];
      const contextBefore = sceneIndex > 0 ? currentScript.scenes[sceneIndex - 1] : null;
      const contextAfter = sceneIndex < currentScript.scenes.length - 1 ? currentScript.scenes[sceneIndex + 1] : null;

      const systemPrompt = `You are regenerating a specific scene in a video script. 

Original video concept: ${originalPrompt}
Visual style: ${visualStyle}
Tone: ${tone}
Scene duration: ${currentScene.duration} seconds

Context:
${contextBefore ? `Previous scene: "${contextBefore.narration}"` : 'This is the first scene'}
Current scene to regenerate: "${currentScene.narration}"
${contextAfter ? `Next scene: "${contextAfter.narration}"` : 'This is the last scene'}

Create a new version of the current scene that:
- Maintains narrative flow with adjacent scenes
- Uses the same duration (${currentScene.duration} seconds)
- Matches the visual style and tone
- Provides fresh content while staying on topic

Respond with JSON in this exact format:
{
  "id": "${sceneId}",
  "duration": ${currentScene.duration},
  "narration": "New narration text for this scene",
  "description": "New detailed visual description for AI image generation",
  "emotion": "appropriate emotion",
  "visualElements": ["element1", "element2", "element3"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Regenerate this scene with fresh content while maintaining the narrative flow.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9,
        max_tokens: 500
      });

      const updatedScene = JSON.parse(response.choices[0].message.content || '{}');
      
      console.log('[OPENAI] Scene regenerated successfully:', sceneId);
      return updatedScene;

    } catch (error) {
      console.error('[OPENAI] Scene regeneration error:', error);
      throw new Error('Failed to regenerate scene with OpenAI GPT-4');
    }
  }
}

export default OpenAIService;
export { OpenAIService };