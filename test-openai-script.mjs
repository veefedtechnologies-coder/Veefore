console.log("Testing OpenAI script generation directly...");

async function testOpenAIScript() {
  try {
    const { OpenAIService } = await import("./server/openai-client.js");
    const service = new OpenAIService();
    
    console.log("OpenAI service created, generating script...");
    
    const script = await service.generateVideoScript({
      prompt: "a man fight with lion",
      duration: 30,
      visualStyle: "cinematic",
      tone: "professional",
      voiceGender: "Female",
      language: "English",
      accent: "American"
    });
    
    console.log("Generated script:", JSON.stringify(script, null, 2));
    
    if (script.scenes && script.scenes.length > 0) {
      console.log("✅ SUCCESS: Script generated with", script.scenes.length, "scenes");
      console.log("First scene narration:", script.scenes[0].narration);
    } else {
      console.log("❌ FAILED: Script has no scenes");
    }
    
  } catch (error) {
    console.error("❌ Script generation failed:", error.message);
  }
}

testOpenAIScript();
