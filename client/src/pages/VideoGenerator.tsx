import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Film, 
  Wand2, 
  Sparkles, 
  Video, 
  Mic, 
  Image, 
  Download, 
  Share2, 
  Settings, 
  Clock, 
  User, 
  Volume2, 
  Eye, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload,
  Bot,
  Zap,
  Star,
  Layers,
  Palette,
  Music,
  FileText,
  RefreshCw,
  Save,
  Trash2,
  RotateCcw,
  Globe,
  AlertCircle,
  Info,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Target,
  Flame,
  Award,
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Scissors,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid,
  List,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Camera,
  Headphones,
  Sliders,
  PaintBucket,
  Type,
  Layers3,
  Lightbulb,
  Cpu,
  Gauge,
  Database,
  Cloud,
  Shield,
  Crown,
  Gem,
  Rocket,
  Atom,
  Infinity,
  Brain,
  Scan,
  MousePointer,
  Command,
  Tablet,
  Smartphone,
  Monitor,
  Tv,
  Wifi,
  Signal,
  Battery,
  Power,
  Plug,
  Bluetooth,
  Network,
  Link,
  QrCode,
  Keyboard,
  Mouse,
  Gamepad2,
  Disc,
  Radio,
  Clapperboard,
  Webcam,
  Focus,
  Aperture,
  Shutter,
  FlashOn,
  FlashOff,
  Contrast,
  Brightness,
  Hue,
  Blur,
  Sharpen,
  Equalizer,
  Mixer,
  Microphone,
  Speaker,
  Earbuds,
  VolumeX,
  Volume1,
  VolumeUp,
  Mute,
  PlayCircle,
  PauseCircle,
  StopCircle,
  FastForward,
  Rewind,
  Repeat1,
  Record,
  Photo,
  Gallery,
  Images,
  PictureInPicture,
  Fullscreen,
  Crop,
  Move,
  Resize,
  Rotate,
  Flip,
  FlipHorizontal,
  FlipVertical,
  Transform,
  Group,
  Ungroup,
  Combine,
  Subtract,
  Pin,
  Anchor,
  Paperclip,
  Magnet,
  Drag,
  Drop,
  Grab,
  Point,
  Click,
  Scroll,
  Swipe,
  Pinch,
  Zoom,
  Magnify,
  Inspect,
  Measure,
  Ruler,
  Scale,
  Compass,
  Triangle,
  Square,
  Circle,
  Diamond,
  Plus,
  Minus,
  Equal,
  LessThan,
  GreaterThan,
  Copy,
  Trash,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Zap as Lightning,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Code,
  Terminal,
  FileCode,
  Folder,
  FolderOpen,
  File,
  Files,
  HardDrive,
  Server,
  Database as DB,
  Cpu as Processor,
  Memory,
  Smartphone as Phone,
  Tablet as TabletIcon,
  Laptop,
  Monitor as Desktop,
  Tv as Television,
  Watch,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Mic as MicIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  Music as MusicIcon,
  Volume,
  VolumeOff,
  Bell,
  BellOff,
  Notification,
  Mail,
  MailOpen,
  Send,
  Inbox,
  Outbox,
  Archive,
  Trash2 as Delete,
  Edit,
  EditIcon,
  Pen,
  PenTool,
  Pencil,
  Eraser,
  Paintbrush,
  Palette as PaletteIcon,
  Pipette,
  Bucket,
  Spray,
  Stamp,
  Sticker,
  Shapes,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Hexagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Cry,
  Surprised,
  Confused,
  Sleepy,
  Wink,
  Kiss,
  Hug,
  ThumbsUp,
  ThumbsDown,
  Clap,
  Wave,
  PointUp,
  PointDown,
  PointLeft,
  PointRight,
  Peace,
  Victory,
  Ok,
  Stop,
  Warning,
  Danger,
  Success,
  Error,
  Question,
  Exclamation,
  Asterisk,
  Hash,
  AtSign,
  Percent,
  Dollar,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  CreditCard,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  Abacus,
  Ruler as RulerIcon,
  Compass as CompassIcon,
  Protractor,
  SetSquare,
  Dividers,
  Pencil as PencilIcon,
  Pen as PenIcon,
  Marker,
  Highlighter,
  Crayon,
  Brush,
  Roller,
  Spray as SprayIcon,
  Bucket as BucketIcon,
  Dropper,
  Syringe,
  Thermometer,
  Gauge as GaugeIcon,
  Speedometer,
  Tachometer,
  Barometer,
  Hygrometer,
  Anemometer,
  Compass as Navigation,
  Map,
  MapPin,
  Navigation as NavigationIcon,
  Route,
  Directions,
  Location,
  GPS,
  Satellite,
  Radar,
  Sonar,
  Telescope,
  Microscope,
  Binoculars,
  Magnifier,
  MagnifyingGlass,
  Loupe,
  Lens,
  Aperture as ApertureIcon,
  Shutter as ShutterIcon,
  Flash,
  Exposure,
  ISO,
  WhiteBalance,
  Histogram,
  Levels,
  Curves,
  Vibrance,
  Saturation,
  Contrast as ContrastIcon,
  Brightness as BrightnessIcon,
  Shadows,
  Highlights,
  Midtones,
  Blacks,
  Whites,
  Clarity,
  Texture,
  Dehaze,
  Noise,
  Grain,
  Vignette,
  ChromaticAberration,
  Distortion,
  Perspective,
  Keystone,
  Rotation,
  Flip as FlipIcon,
  Mirror,
  Symmetry,
  Kaleidoscope,
  Prism,
  Refraction,
  Reflection,
  Diffraction,
  Interference,
  Polarization,
  Spectrum,
  Rainbow,
  Gradient,
  Pattern,
  Texture as TextureIcon,
  Fabric,
  Leather,
  Wood,
  Metal,
  Glass,
  Plastic,
  Ceramic,
  Stone,
  Concrete,
  Brick,
  Tile,
  Marble,
  Granite,
  Slate,
  Sandstone,
  Limestone,
  Chalk,
  Clay,
  Sand,
  Gravel,
  Pebble,
  Rock,
  Crystal,
  Diamond as DiamondIcon,
  Ruby,
  Emerald,
  Sapphire,
  Topaz,
  Amethyst,
  Opal,
  Pearl,
  Coral,
  Amber,
  Jade,
  Turquoise,
  Lapis,
  Malachite,
  Obsidian,
  Quartz,
  Agate,
  Onyx,
  Jasper,
  Garnet,
  Peridot,
  Aquamarine,
  Beryl,
  Citrine,
  Fluorite,
  Pyrite,
  Hematite,
  Magnetite,
  Galena,
  Cinnabar,
  Azurite,
  Malachite as MalachiteIcon,
  Chrysocolla,
  Labradorite,
  Moonstone,
  Sunstone,
  Amazonite,
  Aventurine,
  Carnelian,
  Chalcedony,
  Chrysoprase,
  Bloodstone,
  Agate as AgateIcon,
  Sardonyx,
  Sard,
  Chrysocolla as ChrysocollaIcon,
  Turquoise as TurquoiseIcon,
  Lapis as LapisIcon,
  Sodalite,
  Lazurite,
  Ultramarine,
  Cobalt,
  Prussian,
  Cerulean,
  Azure,
  Teal,
  Cyan,
  Aqua,
  Turquoise as TurquoiseColor,
  Mint,
  Lime,
  Chartreuse,
  Yellow,
  Amber as AmberColor,
  Orange,
  Coral as CoralColor,
  Salmon,
  Pink,
  Rose,
  Magenta,
  Fuchsia,
  Purple,
  Violet,
  Indigo,
  Blue,
  Navy,
  Royal,
  Sapphire as SapphireColor,
  Cobalt as CobaltColor,
  Steel,
  Slate as SlateColor,
  Gray,
  Silver,
  Platinum,
  White,
  Ivory,
  Cream,
  Beige,
  Tan,
  Brown,
  Chocolate,
  Coffee,
  Espresso,
  Mocha,
  Latte,
  Cappuccino,
  Caramel,
  Honey,
  Gold,
  Bronze,
  Copper,
  Brass,
  Pewter,
  Nickel,
  Chrome,
  Aluminum,
  Titanium,
  Iron,
  Lead,
  Tin,
  Zinc,
  Magnesium,
  Calcium,
  Sodium,
  Potassium,
  Lithium,
  Beryllium,
  Boron,
  Carbon,
  Nitrogen,
  Oxygen,
  Fluorine,
  Neon,
  Argon,
  Helium,
  Hydrogen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'

interface VideoJob {
  id: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
  progress: number
  prompt: string
  duration: number
  voiceSettings: {
    gender: string
    language: string
    accent: string
    tone: string
  }
  motionEngine: 'auto' | 'runway' | 'animatediff'
  enableAvatar: boolean
  enableMusic: boolean
  visualStyle: string
  script?: {
    scenes: Array<{
      id: string
      text: string
      description: string
      emotion: string
      duration: number
    }>
  }
  finalVideoUrl?: string
  createdAt: string
  creditsUsed?: number
}

interface GenerationStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  timeEstimate?: string
}

const VideoGenerator: React.FC = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // State management
  const [currentStep, setCurrentStep] = useState<'input' | 'review' | 'customize' | 'generate' | 'preview'>('input')
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    prompt: '',
    duration: 30,
    voiceSettings: {
      gender: 'Female',
      language: 'English',
      accent: 'American',
      tone: 'Professional'
    },
    motionEngine: 'auto',
    enableAvatar: false,
    enableMusic: true,
    visualStyle: 'cinematic',
    enableSubtitles: true
  })

  // Generation steps
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: 'script', name: 'Script Generation', description: 'Creating narrative and scene breakdown', status: 'pending', progress: 0, timeEstimate: '30s' },
    { id: 'scenes', name: 'Scene Creation', description: 'Generating visual scenes with AI', status: 'pending', progress: 0, timeEstimate: '2-3 min' },
    { id: 'motion', name: 'Motion Generation', description: 'Adding cinematic motion to scenes', status: 'pending', progress: 0, timeEstimate: '3-5 min' },
    { id: 'voiceover', name: 'Voiceover', description: 'Generating natural voice narration', status: 'pending', progress: 0, timeEstimate: '1-2 min' },
    { id: 'avatar', name: 'Avatar Creation', description: 'Creating talking avatar (if enabled)', status: 'pending', progress: 0, timeEstimate: '2-3 min' },
    { id: 'editing', name: 'Video Editing', description: 'Stitching and finalizing video', status: 'pending', progress: 0, timeEstimate: '1-2 min' }
  ])

  // Fetch video jobs
  const { data: videoJobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/video/jobs'],
    queryFn: () => apiRequest('/api/video/jobs'),
    refetchInterval: false // Disable automatic refetching to prevent app refreshes
  })

  // Ensure videoJobs is always an array
  const videoJobs = Array.isArray(videoJobsData) ? videoJobsData : []

  // Generate video mutation
  const generateVideoMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest('/api/video/generate', { method: 'POST', body: data }),
    onSuccess: (data) => {
      toast({ title: 'Video generation started!', description: 'Your video is being created. This may take 5-10 minutes.' })
      setSelectedJob(data)
      setCurrentStep('generate')
      setIsGenerating(true)
      queryClient.invalidateQueries({ queryKey: ['/api/video/jobs'] })
    },
    onError: (error: any) => {
      toast({ title: 'Generation failed', description: error.message || 'Failed to start video generation', variant: 'destructive' })
    }
  })

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => apiRequest(`/api/video-jobs/${jobId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: 'Video deleted', description: 'Video has been successfully deleted.' })
      queryClient.invalidateQueries({ queryKey: ['/api/video-jobs'] })
    }
  })

  // Handle form submission
  const handleGenerate = () => {
    if (!formData.prompt.trim()) {
      toast({ title: 'Prompt required', description: 'Please enter a video idea or prompt.', variant: 'destructive' })
      return
    }
    generateVideoMutation.mutate(formData)
  }

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Update voice settings
  const updateVoiceSettings = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      voiceSettings: {
        ...prev.voiceSettings,
        [field]: value
      }
    }))
  }

  // Render input form
  const renderInputForm = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Video className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Video Generator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your ideas into cinematic videos with AI. Just describe what you want, and our advanced AI will create scenes, motion, voiceover, and stitch everything together.
        </p>
      </div>

      {/* Main input form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Video Prompt
          </CardTitle>
          <CardDescription>
            Describe your video idea, story, or concept. Be as detailed as possible for best results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Your Video Idea</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Create a motivational video about overcoming challenges, with cinematic scenes of a person climbing a mountain at sunrise, inspiring voiceover about persistence and success..."
              value={formData.prompt}
              onChange={(e) => updateFormData('prompt', e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Settings grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.duration]}
                  onValueChange={(value) => updateFormData('duration', value[0])}
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
            </div>

            {/* Visual Style */}
            <div className="space-y-2">
              <Label>Visual Style</Label>
              <Select value={formData.visualStyle} onValueChange={(value) => updateFormData('visualStyle', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">🎬 Cinematic</SelectItem>
                  <SelectItem value="realistic">📸 Realistic</SelectItem>
                  <SelectItem value="animated">🎨 Animated</SelectItem>
                  <SelectItem value="artistic">🖼️ Artistic</SelectItem>
                  <SelectItem value="documentary">📹 Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Motion Engine */}
            <div className="space-y-2">
              <Label>Motion Engine</Label>
              <Select value={formData.motionEngine} onValueChange={(value) => updateFormData('motionEngine', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">🤖 Auto (AI Decides)</SelectItem>
                  <SelectItem value="runway">🎭 Runway Gen-2 (Premium)</SelectItem>
                  <SelectItem value="animatediff">⚡ AnimateDiff (Budget)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Voice Settings */}
            <div className="space-y-2">
              <Label>Voice Settings</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={formData.voiceSettings.gender} onValueChange={(value) => updateVoiceSettings('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.voiceSettings.tone} onValueChange={(value) => updateVoiceSettings('tone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Dramatic">Dramatic</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                    <SelectItem value="Calm">Calm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Talking Avatar</span>
                </div>
                <Switch
                  checked={formData.enableAvatar}
                  onCheckedChange={(checked) => updateFormData('enableAvatar', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Background Music</span>
                </div>
                <Switch
                  checked={formData.enableMusic}
                  onCheckedChange={(checked) => updateFormData('enableMusic', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Subtitles</span>
                </div>
                <Switch
                  checked={formData.enableSubtitles}
                  onCheckedChange={(checked) => updateFormData('enableSubtitles', checked)}
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              disabled={generateVideoMutation.isPending || !formData.prompt.trim()}
            >
              {generateVideoMutation.isPending ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Starting Generation...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render generation progress
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
          Our AI is hard at work creating your video. This process typically takes 5-10 minutes.
        </p>
      </div>

      {/* Overall progress */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generation Progress</span>
            <span className="text-sm font-normal text-gray-600">
              {selectedJob?.progress || 0}% Complete
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={selectedJob?.progress || 0} className="h-2 mb-4" />
          <div className="space-y-4">
            {generationSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : step.status === 'processing' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                  ) : step.status === 'failed' ? (
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.name}</h4>
                    {step.timeEstimate && step.status === 'processing' && (
                      <span className="text-xs text-gray-500">~{step.timeEstimate}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.status === 'processing' && (
                    <Progress value={step.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep('input')
            setIsGenerating(false)
            setSelectedJob(null)
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel Generation
        </Button>
      </div>
    </div>
  )

  // Render video preview
  const renderVideoPreview = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Video Generated Successfully!</h2>
        <p className="text-gray-600">
          Your video has been created and is ready to download or share.
        </p>
      </div>

      {/* Video player */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
            {selectedJob?.finalVideoUrl ? (
              <video
                src={selectedJob.finalVideoUrl}
                controls
                className="w-full h-full rounded-lg"
              />
            ) : (
              <div className="text-white text-center">
                <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="opacity-75">Video player will appear here</p>
              </div>
            )}
          </div>
          
          {/* Video info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Generated Video</h3>
              <p className="text-sm text-gray-600">
                Duration: {formData.duration}s • {formData.visualStyle} style • {selectedJob?.creditsUsed || 0} credits used
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button size="sm" variant="outline">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Video
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Generate Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render video history
  const renderVideoHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Videos</h3>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoJobs?.map((job: VideoJob) => (
          <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                {job.finalVideoUrl ? (
                  <video
                    src={job.finalVideoUrl}
                    className="w-full h-full rounded-lg object-cover"
                    muted
                  />
                ) : (
                  <Film className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={
                    job.status === 'completed' ? 'default' :
                    job.status === 'generating' ? 'secondary' :
                    job.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {job.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteJobMutation.mutate(job.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {job.prompt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{job.duration}s</span>
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                
                {job.status === 'generating' && (
                  <Progress value={job.progress} className="h-1" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!videoJobs?.length && !jobsLoading && (
        <div className="text-center py-12">
          <Film className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No videos generated yet</p>
          <p className="text-sm text-gray-500">Start by creating your first AI video above</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            {['input', 'generate', 'preview'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  currentStep === step ? 'bg-purple-500' : 'bg-gray-300'
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
        
        {/* Video history */}
        {currentStep === 'input' && (
          <div className="max-w-7xl mx-auto">
            {renderVideoHistory()}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoGenerator