import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Film, Sparkles, Bot, Eye, RefreshCw, Play, Download, Trash2 } from 'lucide-react'

interface VideoJob {
  id: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
  progress: number
  prompt: string
  duration: number
  visualStyle: string
  finalVideoUrl?: string
  createdAt: string
}

const VideoGeneratorSimple: React.FC = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    duration: 30,
    visualStyle: 'cinematic',
    motionEngine: 'auto',
    enableAvatar: false,
    enableMusic: false,
    voiceSettings: {
      gender: 'female',
      tone: 'professional'
    }
  })

  const [currentStep, setCurrentStep] = useState<'input' | 'generate' | 'preview'>('input')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleGenerate = () => {
    if (!formData.prompt.trim()) {
      alert('Please enter a video prompt')
      return
    }
    
    setIsGenerating(true)
    setCurrentStep('generate')
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
      setCurrentStep('preview')
    }, 3000)
  }

  const renderInputForm = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Video Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create professional videos with AI. Describe your vision and let our AI bring it to life.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Video Prompt
          </CardTitle>
          <CardDescription>
            Describe your video idea in detail for best results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Your Video Idea</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Create a motivational video about success, with cinematic scenes and inspiring voiceover..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              className="min-h-[120px] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Slider
                value={[formData.duration]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value[0] }))}
                min={15}
                max={120}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>15s</span>
                <span className="font-medium">{formData.duration}s</span>
                <span>2min</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visual Style</Label>
              <Select value={formData.visualStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, visualStyle: value }))}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="cinematic">🎬 Cinematic</SelectItem>
                  <SelectItem value="realistic">📸 Realistic</SelectItem>
                  <SelectItem value="animated">🎨 Animated</SelectItem>
                  <SelectItem value="artistic">🖼️ Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <div>
                  <Label>AI Avatar</Label>
                  <p className="text-sm text-gray-500">Add a virtual presenter</p>
                </div>
              </div>
              <Switch
                checked={formData.enableAvatar}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableAvatar: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 text-green-500">🎵</span>
                <div>
                  <Label>Background Music</Label>
                  <p className="text-sm text-gray-500">Add AI-generated music</p>
                </div>
              </div>
              <Switch
                checked={formData.enableMusic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableMusic: checked }))}
              />
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6"
            onClick={handleGenerate}
            disabled={!formData.prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate Video
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderGenerationProgress = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Creating Your Video</h2>
        <p className="text-gray-600">
          AI is generating your video. This usually takes 5-10 minutes.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={66} className="h-2 mb-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Script generation complete</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <RefreshCw className="w-3 h-3 text-white animate-spin" />
              </div>
              <span>Creating video scenes...</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">3</span>
              </div>
              <span className="text-gray-500">Adding voiceover</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderVideoPreview = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Video Complete!</h2>
        <p className="text-gray-600">
          Your AI-generated video is ready. Preview and download below.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video Preview</p>
              <p className="text-sm text-gray-400">Click to play your generated video</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">{formData.prompt.slice(0, 50)}...</h3>
              <p className="text-sm text-gray-500">{formData.duration}s • {formData.visualStyle}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play Video
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            {[
              { id: 'input', label: 'Input' },
              { id: 'generate', label: 'Generate' },
              { id: 'preview', label: 'Preview' }
            ].map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentStep === step.id ? 'bg-purple-500' : 'bg-gray-300'
                }`} />
                {index < 2 && <div className="w-6 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        {currentStep === 'input' && renderInputForm()}
        {currentStep === 'generate' && renderGenerationProgress()}
        {currentStep === 'preview' && renderVideoPreview()}
      </div>
    </div>
  )
}

export default VideoGeneratorSimple