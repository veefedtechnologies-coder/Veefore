import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Play, 
  Download, 
  Settings, 
  Eye, 
  Clock,
  Palette,
  Music,
  Mic,
  User,
  Globe,
  Sparkles,
  FileText,
  Clapperboard,
  Wand2,
  DollarSign,
  Zap,
  Timer,
  Monitor,
  AspectRatio,
  ArrowLeft,
  Info
} from 'lucide-react';

interface ScriptScene {
  id: string;
  duration: number;
  description: string;
  visualStyle: string;
  voiceover: string;
}

interface GeneratedScript {
  title: string;
  totalDuration: number;
  scenes: ScriptScene[];
  hook: string;
  callToAction: string;
}

const VideoGeneratorAdvanced = () => {
  const [currentStep, setCurrentStep] = useState<'prompt' | 'settings' | 'script' | 'advanced' | 'preview'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Generated script state
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  
  // Advanced settings based on video-generator.md specifications
  const [settings, setSettings] = useState({
    // Video Quality & Duration
    duration: 60,
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    
    // Motion Engine (core feature from video-generator.md)
    motionEngine: 'Auto', // Auto, Runway Gen-2, AnimateDiff + Interpolation
    visualStyle: 'cinematic',
    
    // Voice & Audio (comprehensive ElevenLabs integration)
    voiceGender: 'female',
    voiceLanguage: 'English',
    voiceAccent: 'American',
    voiceTone: 'professional',
    voiceStability: 0.4,
    voiceSimilarity: 0.75,
    
    // Background Audio
    backgroundMusic: true,
    musicGenre: 'corporate',
    musicVolume: 0.3,
    
    // Avatar & Visual Features (Hedra integration)
    avatar: false,
    avatarStyle: 'realistic',
    avatarPosition: 'corner', // corner, fullscreen, intro-only
    
    // Text & Captions
    language: 'en',
    captions: true,
    captionStyle: 'modern',
    onScreenText: true,
    
    // Effects & Transitions
    transitions: 'smooth',
    colorScheme: 'vibrant',
    zoomEffects: true,
    fadeTransitions: true,
    
    // Advanced Features
    enableWatermark: true,
    enableLogo: false,
    speedControl: 1.0, // 0.5x to 2.0x
    enableColorGrading: true
  });

  // Sample projects
  const recentProjects = [
    {
      id: 1,
      title: 'Sci-Fi Adventure',
      thumbnail: '🌌',
      lastEdited: '2 days ago',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Product Demo',
      thumbnail: '📱',
      lastEdited: '5 days ago',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Travel Vlog',
      thumbnail: '🗺️',
      lastEdited: '1 week ago',
      status: 'completed'
    }
  ];

  const generateScript = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('script');
    
    // Simulate script generation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Generate sample script
          const sampleScript: GeneratedScript = {
            title: "AI-Generated Video Script",
            totalDuration: settings.duration,
            hook: "Hook your audience with an attention-grabbing opening that immediately addresses their pain point or curiosity.",
            callToAction: "Don't forget to like and subscribe for more amazing content!",
            scenes: [
              {
                id: '1',
                duration: 8,
                description: 'Opening scene with dramatic landscape and title overlay',
                visualStyle: 'Cinematic wide shot with golden hour lighting',
                voiceover: 'Welcome to an incredible journey that will change everything you know about...'
              },
              {
                id: '2', 
                duration: 15,
                description: 'Problem introduction with animated graphics',
                visualStyle: 'Clean animated graphics with bold typography',
                voiceover: 'Millions of people struggle with this exact challenge every single day. But what if there was a better way?'
              },
              {
                id: '3',
                duration: 20,
                description: 'Solution demonstration with real examples',
                visualStyle: 'Split screen showing before and after scenarios',
                voiceover: 'Introducing our revolutionary approach that has helped thousands of people achieve remarkable results.'
              },
              {
                id: '4',
                duration: 12,
                description: 'Benefits and features highlight',
                visualStyle: 'Dynamic motion graphics with feature callouts',
                voiceover: 'With these powerful features, you can achieve results faster than ever before.'
              },
              {
                id: '5',
                duration: 5,
                description: 'Call to action with subscribe button',
                visualStyle: 'Branded outro with animated subscribe button',
                voiceover: 'Ready to get started? Click the link below and join thousands of satisfied users!'
              }
            ]
          };
          
          setGeneratedScript(sampleScript);
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  const renderPromptStep = () => (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex min-h-screen flex-col">
        {/* Header matching Cosmos Studio exactly */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
          <div className="flex items-center gap-4 text-[#141414]">
            <div className="size-4">
              <Video className="w-4 h-4" />
            </div>
            <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">VeeFore Studio</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Dashboard</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Templates</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Tutorials</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Community</a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#ededed] text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
              </svg>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocJPrcoVstl69SDbEJG3VutOYCtG2q1O0L-jelhQ0JSevpHsGg=s96-c")'}}></div>
          </div>
        </header>

        {/* Main content area matching exact layout */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Main title */}
            <h1 className="text-[#141414] tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
              Unleash Your Creativity with AI-Powered Video Generation
            </h1>
            
            {/* Input area - exact match */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  placeholder="Describe your video idea, and let AI bring it to life"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none min-h-36 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                />
              </label>
            </div>
            
            {/* Generate button - exact match */}
            <div className="flex px-4 py-3 justify-center">
              <button
                onClick={() => setCurrentStep('settings')}
                disabled={!prompt.trim()}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-black text-neutral-50 text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                <span className="truncate">Generate Video</span>
              </button>
            </div>

            {/* Recent Projects - exact match */}
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Recent Projects</h3>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col bg-gradient-to-br from-purple-400 to-blue-500"></div>
                    <div>
                      <p className="text-[#141414] text-base font-medium leading-normal">{project.title}</p>
                      <p className="text-neutral-500 text-sm font-normal leading-normal">Last edited: {project.lastEdited}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant & Tips - exact match */}
            <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">AI Assistant & Tips</h3>
            <p className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Need help getting started? Explore our tutorials or ask our AI assistant for guidance on crafting the perfect video prompt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsStep = () => (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-neutral-50 via-white to-neutral-100" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex min-h-screen flex-col">
        {/* Header with enhanced visual appeal */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 text-[#141414]">
            <div className="size-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">VeeFore Studio</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#141414] text-sm font-medium leading-normal hover:text-purple-600 transition-colors duration-200" href="#">Dashboard</a>
              <a className="text-[#141414] text-sm font-medium leading-normal hover:text-purple-600 transition-colors duration-200" href="#">Templates</a>
              <a className="text-[#141414] text-sm font-medium leading-normal hover:text-purple-600 transition-colors duration-200" href="#">Tutorials</a>
              <a className="text-[#141414] text-sm font-medium leading-normal hover:text-purple-600 transition-colors duration-200" href="#">Community</a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-all duration-200 shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
              </svg>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-purple-200 shadow-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/a/ACg8ocJPrcoVstl69SDbEJG3VutOYCtG2q1O0L-jelhQ0JSevpHsGg=s96-c")'}}></div>
          </div>
        </header>

        {/* Main content area with enhanced visuals */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Enhanced title section with animations */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-[#141414] tracking-light text-[32px] font-bold leading-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Configure Your Video Settings
                </h1>
              </div>
              <p className="text-neutral-500 text-base font-normal leading-normal max-w-2xl mx-auto">
                Customize every aspect of your video creation with our advanced AI-powered settings. From motion engines to voice synthesis, create exactly what you envision.
              </p>
              
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Step 2 of 4 - Video Configuration</p>
            </div>
            
            {/* Enhanced Settings Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 animate-fade-in-up">
              {/* Duration & Quality - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Duration & Quality</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Video Duration</label>
                    <select
                      value={settings.duration}
                      onChange={(e) => setSettings(prev => ({...prev, duration: parseInt(e.target.value)}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={90}>1.5 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Resolution</label>
                    <select
                      value={settings.resolution}
                      onChange={(e) => setSettings(prev => ({...prev, resolution: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="720p">720p HD</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="4K">4K Ultra HD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Aspect Ratio</label>
                    <select
                      value={settings.aspectRatio}
                      onChange={(e) => setSettings(prev => ({...prev, aspectRatio: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="16:9">16:9 Landscape</option>
                      <option value="9:16">9:16 Portrait</option>
                      <option value="1:1">1:1 Square</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Motion Engine - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Motion Engine</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Generation Method</label>
                    <select
                      value={settings.motionEngine}
                      onChange={(e) => setSettings(prev => ({...prev, motionEngine: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="Auto">Auto (AI Decides) - Recommended</option>
                      <option value="Runway Gen-2">Runway Gen-2 (Cinematic Quality)</option>
                      <option value="AnimateDiff">AnimateDiff + Interpolation (Budget)</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-600 bg-white/50 p-3 rounded-lg">
                    {settings.motionEngine === 'Auto' && "AI analyzes scene complexity and credits to choose the best engine"}
                    {settings.motionEngine === 'Runway Gen-2' && "Premium cinematic quality. 10-20 credits per scene"}
                    {settings.motionEngine === 'AnimateDiff' && "Budget-friendly with smooth interpolation. 2-5 credits per scene"}
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Visual Style</label>
                    <select
                      value={settings.visualStyle}
                      onChange={(e) => setSettings(prev => ({...prev, visualStyle: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="realistic">Realistic</option>
                      <option value="stylized">Stylized</option>
                      <option value="anime">Anime</option>
                      <option value="documentary">Documentary</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Voice & Audio - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Voice & Audio</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Voice Gender</label>
                    <select
                      value={settings.voiceGender}
                      onChange={(e) => setSettings(prev => ({...prev, voiceGender: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Language & Accent</label>
                    <select
                      value={settings.voiceLanguage}
                      onChange={(e) => setSettings(prev => ({...prev, voiceLanguage: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="English">English (American)</option>
                      <option value="English-UK">English (British)</option>
                      <option value="English-AU">English (Australian)</option>
                      <option value="Hindi">Hindi (Indian)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Voice Tone</label>
                    <select
                      value={settings.voiceTone}
                      onChange={(e) => setSettings(prev => ({...prev, voiceTone: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="energetic">Energetic</option>
                      <option value="calm">Calm</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <span className="text-[#141414] text-sm font-medium leading-normal">Background Music</span>
                    <input
                      type="checkbox"
                      checked={settings.backgroundMusic}
                      onChange={(e) => setSettings(prev => ({...prev, backgroundMusic: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar & Visual Features - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Avatar & Visual Features</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">AI Avatar</span>
                      <span className="text-neutral-500 text-xs">Talking head with lip sync</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.avatar}
                      onChange={(e) => setSettings(prev => ({...prev, avatar: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  {settings.avatar && (
                    <>
                      <div>
                        <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Avatar Style</label>
                        <select
                          value={settings.avatarStyle}
                          onChange={(e) => setSettings(prev => ({...prev, avatarStyle: e.target.value}))}
                          className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                        >
                          <option value="realistic">Realistic</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="animated">Animated</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Avatar Position</label>
                        <select
                          value={settings.avatarPosition}
                          onChange={(e) => setSettings(prev => ({...prev, avatarPosition: e.target.value}))}
                          className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                        >
                          <option value="corner">Corner Overlay</option>
                          <option value="intro-only">Intro Only (5-10s)</option>
                          <option value="fullscreen">Full Screen</option>
                          <option value="cutins">Story Cut-ins</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">Auto Captions</span>
                      <span className="text-neutral-500 text-xs">AI-generated subtitles</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.captions}
                      onChange={(e) => setSettings(prev => ({...prev, captions: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">On-Screen Text</span>
                      <span className="text-neutral-500 text-xs">Key quotes & highlights</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.onScreenText}
                      onChange={(e) => setSettings(prev => ({...prev, onScreenText: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Effects & Transitions - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Effects & Transitions</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Transition Style</label>
                    <select
                      value={settings.transitions}
                      onChange={(e) => setSettings(prev => ({...prev, transitions: e.target.value}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value="smooth">Smooth Fade</option>
                      <option value="crossfade">Cross Fade</option>
                      <option value="slide">Slide Transition</option>
                      <option value="wipe">Wipe Effect</option>
                      <option value="zoom">Zoom Transition</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">Zoom Effects</span>
                      <span className="text-neutral-500 text-xs">Dynamic camera movements</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.zoomEffects}
                      onChange={(e) => setSettings(prev => ({...prev, zoomEffects: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">Color Grading</span>
                      <span className="text-neutral-500 text-xs">Cinematic color correction</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableColorGrading}
                      onChange={(e) => setSettings(prev => ({...prev, enableColorGrading: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Speed Control</label>
                    <select
                      value={settings.speedControl}
                      onChange={(e) => setSettings(prev => ({...prev, speedControl: parseFloat(e.target.value)}))}
                      className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                    >
                      <option value={0.5}>0.5x (Slow Motion)</option>
                      <option value={0.75}>0.75x (Slow)</option>
                      <option value={1.0}>1.0x (Normal)</option>
                      <option value={1.25}>1.25x (Fast)</option>
                      <option value={1.5}>1.5x (Faster)</option>
                      <option value={2.0}>2.0x (Time-lapse)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Music & Audio Settings - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-pink-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Background Music</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                    <div>
                      <span className="text-[#141414] text-sm font-medium leading-normal block">Enable Music</span>
                      <span className="text-neutral-500 text-xs">Add background soundtrack</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.backgroundMusic}
                      onChange={(e) => setSettings(prev => ({...prev, backgroundMusic: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  {settings.backgroundMusic && (
                    <>
                      <div>
                        <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Music Genre</label>
                        <select
                          value={settings.musicGenre}
                          onChange={(e) => setSettings(prev => ({...prev, musicGenre: e.target.value}))}
                          className="w-full rounded-xl bg-neutral-50 border-none p-3 text-[#141414] focus:outline-0 focus:ring-0"
                        >
                          <option value="corporate">Corporate</option>
                          <option value="cinematic">Cinematic</option>
                          <option value="upbeat">Upbeat</option>
                          <option value="ambient">Ambient</option>
                          <option value="emotional">Emotional</option>
                          <option value="tech">Tech/Electronic</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#141414] text-sm font-medium leading-normal block mb-2">Music Volume</label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.8"
                          step="0.1"
                          value={settings.musicVolume}
                          onChange={(e) => setSettings(prev => ({...prev, musicVolume: parseFloat(e.target.value)}))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-1">
                          <span>Quiet</span>
                          <span>{Math.round(settings.musicVolume * 100)}%</span>
                          <span>Loud</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Credit Estimation & Cost Preview - Enhanced */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-yellow-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Cost Estimation</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Motion Engine:</span>
                    <span className="text-[#141414] font-medium">{settings.motionEngine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Est. Credits per Scene:</span>
                    <span className="text-[#141414] font-medium">
                      {settings.motionEngine === 'Runway Gen-2' ? '10-20' : 
                       settings.motionEngine === 'AnimateDiff' ? '2-5' : 
                       'Auto (varies)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated Scenes:</span>
                    <span className="text-[#141414] font-medium">{Math.ceil(settings.duration / 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Voice Generation:</span>
                    <span className="text-[#141414] font-medium">5 credits</span>
                  </div>
                  {settings.avatar && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Avatar Lip Sync:</span>
                      <span className="text-[#141414] font-medium">15 credits</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-[#141414]">Total Estimated:</span>
                    <span className="text-[#141414]">
                      {(() => {
                        const scenes = Math.ceil(settings.duration / 10);
                        const motionCost = settings.motionEngine === 'Runway Gen-2' ? scenes * 15 : 
                                         settings.motionEngine === 'AnimateDiff' ? scenes * 3.5 : 
                                         scenes * 8;
                        const voiceCost = 5;
                        const avatarCost = settings.avatar ? 15 : 0;
                        return Math.ceil(motionCost + voiceCost + avatarCost);
                      })()} credits
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    * Final cost may vary based on actual scene complexity and AI optimization
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modern Action Buttons with Floating Design */}
            <div className="flex px-4 py-8 justify-center gap-6">
              <button
                onClick={() => setCurrentStep('prompt')}
                className="group flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-8 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-[#141414] text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="truncate">Back</span>
              </button>
              <button
                onClick={generateScript}
                className="group flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 animate-pulse-glow"
              >
                <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                <span className="truncate">Generate Script</span>
                <Sparkles className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Floating Action Hint */}
            <div className="flex justify-center pb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Configure your settings, then generate your AI script
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScriptStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generated Script & Scenes</h1>
          <p className="text-gray-600">Review and customize your AI-generated video script</p>
        </div>

        {isGenerating ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Generating Your Script...</h3>
                <Progress value={progress} className="h-2 mb-4" />
                <p className="text-gray-600">AI is creating scenes and voiceover based on your prompt</p>
              </CardContent>
            </Card>
          </div>
        ) : generatedScript ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Script Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Script Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Duration</label>
                      <p className="text-lg">{generatedScript.totalDuration}s</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Scenes</label>
                      <p className="text-lg">{generatedScript.scenes.length}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Hook</label>
                      <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">{generatedScript.hook}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Call to Action</label>
                      <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{generatedScript.callToAction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenes */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clapperboard className="w-5 h-5" />
                    Video Scenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedScript.scenes.map((scene, index) => (
                      <div key={scene.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">Scene {index + 1}</span>
                          </div>
                          <Badge variant="outline">{scene.duration}s</Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Visual</label>
                            <p className="text-gray-900">{scene.description}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Style</label>
                            <p className="text-gray-700 text-sm">{scene.visualStyle}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Voiceover</label>
                            <p className="text-gray-700 text-sm italic">"{scene.voiceover}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Script Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Script
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setCurrentStep('advanced')}
                  >
                    Continue to Advanced Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Your Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {prompt}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Settings & Features</h1>
          <p className="text-gray-600">Customize your video generation parameters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Settings */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Duration
                    </label>
                    <select 
                      value={settings.duration}
                      onChange={(e) => setSettings(prev => ({...prev, duration: parseInt(e.target.value)}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={90}>1.5 minutes</option>
                      <option value={120}>2 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                    <select 
                      value={settings.aspectRatio}
                      onChange={(e) => setSettings(prev => ({...prev, aspectRatio: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                      <option value="1:1">1:1 (Square)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <select 
                      value={settings.resolution}
                      onChange={(e) => setSettings(prev => ({...prev, resolution: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="720p">720p HD</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="4k">4K Ultra HD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Visual Style
                    </label>
                    <select 
                      value={settings.visualStyle}
                      onChange={(e) => setSettings(prev => ({...prev, visualStyle: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="realistic">Realistic</option>
                      <option value="animated">Animated</option>
                      <option value="artistic">Artistic</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Audio & Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voice Gender</label>
                    <select 
                      value={settings.voiceGender}
                      onChange={(e) => setSettings(prev => ({...prev, voiceGender: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voice Tone</label>
                    <select 
                      value={settings.voiceTone}
                      onChange={(e) => setSettings(prev => ({...prev, voiceTone: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="energetic">Energetic</option>
                      <option value="calm">Calm</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Music className="w-4 h-4 mr-2" />
                        Background Music
                      </label>
                      <p className="text-xs text-gray-500">Add AI-generated background music</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.backgroundMusic}
                      onChange={(e) => setSettings(prev => ({...prev, backgroundMusic: e.target.checked}))}
                      className="rounded"
                    />
                  </div>
                  
                  {settings.backgroundMusic && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Music Genre</label>
                      <select 
                        value={settings.musicGenre}
                        onChange={(e) => setSettings(prev => ({...prev, musicGenre: e.target.value}))}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="corporate">Corporate</option>
                        <option value="upbeat">Upbeat</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="ambient">Ambient</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2" />
                      AI Avatar
                    </label>
                    <p className="text-xs text-gray-500">Add a virtual presenter to your video</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.avatar}
                    onChange={(e) => setSettings(prev => ({...prev, avatar: e.target.checked}))}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Captions</label>
                    <p className="text-xs text-gray-500">Auto-generate subtitles</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.captions}
                    onChange={(e) => setSettings(prev => ({...prev, captions: e.target.checked}))}
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Settings Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{settings.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <span>{settings.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ratio:</span>
                    <span>{settings.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span>{settings.visualStyle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Generate Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setCurrentStep('preview')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate Final Video
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Pro Tip</h4>
                <p className="text-sm text-gray-700">
                  Higher resolution videos take longer to generate but provide better quality for professional use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Preview</h1>
          <p className="text-gray-600">Your AI-generated video is ready!</p>
        </div>

        <Card className="bg-white">
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-20 h-20 mx-auto mb-4 opacity-70" />
                <p className="text-xl">Generated Video Preview</p>
                <p className="text-gray-400">Click to play your AI-generated video</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Details</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{settings.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span>{settings.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span>{settings.visualStyle}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {settings.backgroundMusic && <Badge variant="secondary">Music</Badge>}
                  {settings.avatar && <Badge variant="secondary">AI Avatar</Badge>}
                  {settings.captions && <Badge variant="secondary">Captions</Badge>}
                  <Badge variant="secondary">{settings.voiceGender} Voice</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
              <Button variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentStep('prompt');
                  setPrompt('');
                  setGeneratedScript(null);
                }}
              >
                Create New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Main render logic
  switch (currentStep) {
    case 'prompt':
      return renderPromptStep();
    case 'settings':
      return renderSettingsStep();
    case 'script':
      return renderScriptStep();
    case 'advanced':
      return renderAdvancedSettings();
    case 'preview':
      return renderPreview();
    default:
      return renderPromptStep();
  }
};

export default VideoGeneratorAdvanced;