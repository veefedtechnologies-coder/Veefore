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
  Wand2
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
  const [currentStep, setCurrentStep] = useState<'prompt' | 'script' | 'settings' | 'preview'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Generated script state
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  
  // Advanced settings
  const [settings, setSettings] = useState({
    duration: 60,
    aspectRatio: '16:9',
    resolution: '1080p',
    visualStyle: 'cinematic',
    voiceGender: 'female',
    voiceTone: 'professional',
    backgroundMusic: true,
    musicGenre: 'corporate',
    avatar: false,
    avatarStyle: 'realistic',
    language: 'en',
    captions: true,
    transitions: 'smooth',
    colorScheme: 'vibrant'
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
      <div className="layout-container flex h-full grow flex-col">
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
                onClick={generateScript}
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
                    onClick={() => setCurrentStep('settings')}
                  >
                    Continue to Settings
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
    case 'script':
      return renderScriptStep();
    case 'settings':
      return renderAdvancedSettings();
    case 'preview':
      return renderPreview();
    default:
      return renderPromptStep();
  }
};

export default VideoGeneratorAdvanced;