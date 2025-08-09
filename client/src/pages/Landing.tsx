import React, { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown, ChevronUp, Play, Star, TrendingUp, Users, Zap, Shield, Target, Globe, ArrowRight, Check, 
  Building2, BarChart3, Calendar, MessageSquare, Bot, Award, Eye, Heart, 
  Lightbulb, Settings, Lock, 
  Sparkles, Crown, Cpu, Brain, 
  Network, Wand2, Palette, Video, Image, Database, Code, Cloud, Activity, 
  ShoppingCart, CreditCard, ExternalLink, Github, Twitter, MousePointer2,
  Sparkle, Triangle, Send, PlayCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Import generated interface images
import VeeGPTInterface from '@assets/generated_images/VeeGPT_AI_Chat_Interface_9461d5ae.png'
import VideoStudioInterface from '@assets/generated_images/AI_Video_Studio_Interface_c4227f2a.png'
import AnalyticsInterface from '@assets/generated_images/Analytics_Dashboard_Interface_939945d5.png'
import ContentStudioInterface from '@assets/generated_images/Content_Studio_Interface_840b3ab8.png'

interface LandingProps {
  onNavigate: (view: string) => void
}

const Landing = ({ onNavigate }: LandingProps) => {
  const [activeFeature, setActiveFeature] = useState(0)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [previewMode, setPreviewMode] = useState<'overview' | 'detailed'>('overview')
  const [isInteractionActive, setIsInteractionActive] = useState(false)
  const [liveStats, setLiveStats] = useState({
    conversations: 2847,
    contentGenerated: 1203,
    analyticsViews: 856,
    activeUsers: 342
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-cycle through features
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 8)
    }, 4000)

    // Simulate live data updates
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        conversations: prev.conversations + Math.floor(Math.random() * 5),
        contentGenerated: prev.contentGenerated + Math.floor(Math.random() * 3),
        analyticsViews: prev.analyticsViews + Math.floor(Math.random() * 4),
        activeUsers: Math.max(200, prev.activeUsers + Math.floor(Math.random() * 4) - 2)
      }))
    }, 3000)

    // Update current time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => {
      clearInterval(featureInterval)
      clearInterval(statsInterval)
      clearInterval(timeInterval)
    }
  }, [])

  const handleNavigation = (page: string) => {
    onNavigate(page)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Core platform features with detailed descriptions
  const platformFeatures = [
    {
      id: "veegpt",
      title: "VeeGPT - AI Chat Assistant",
      subtitle: "ChatGPT-like Interface",
      description: "Advanced conversational AI that understands context, generates content, and provides strategic insights. Built specifically for social media creators and marketers.",
      image: "/api/placeholder/600/400",
      icon: <Bot className="w-8 h-8" />,
      color: "from-violet-500 to-purple-600",
      features: ["Real-time streaming responses", "Context-aware conversations", "Content generation", "Strategy assistance", "Multi-platform insights"],
      link: "/veegpt"
    },
    {
      id: "video-gen",
      title: "AI Video Studio - Cosmos Generator",
      subtitle: "Professional Video Creation",
      description: "Revolutionary AI video creation with automated script writing, scene generation, voiceovers, and professional editing. Create viral content in minutes.",
      image: "/api/placeholder/600/400",
      icon: <Video className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      features: ["AI script generation", "Automated scene creation", "Professional voiceovers", "Smart editing", "Multi-format export"],
      link: "/video-generator"
    },
    {
      id: "analytics",
      title: "Analytics Pro - Deep Insights",
      subtitle: "Performance Analytics",
      description: "Comprehensive analytics dashboard with real-time metrics, engagement tracking, competitor analysis, and predictive insights for growth optimization.",
      image: "/api/placeholder/600/400",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      features: ["Real-time metrics", "Engagement tracking", "Competitor analysis", "Growth predictions", "ROI insights"],
      link: "/analytics"
    },
    {
      id: "content",
      title: "Content Studio - Smart Creation",
      subtitle: "AI Content Generation",
      description: "Intelligent content creation with trend analysis, audience insights, and automated optimization. Generate posts, captions, and campaigns that convert.",
      image: "/api/placeholder/600/400",
      icon: <Palette className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      features: ["AI content generation", "Trend analysis", "Audience targeting", "A/B testing", "Performance optimization"],
      link: "/content-studio"
    },
    {
      id: "automation",
      title: "Smart Automation - Workflows",
      subtitle: "Intelligent Automation",
      description: "Advanced automation engine for social media workflows, comment responses, DM management, and engagement optimization across all platforms.",
      image: "/api/placeholder/600/400",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      features: ["Workflow automation", "Smart responses", "Engagement optimization", "Multi-platform sync", "Custom triggers"],
      link: "/automation"
    },
    {
      id: "inbox",
      title: "Unified Inbox - Conversations",
      subtitle: "Social Communication",
      description: "Manage all social conversations from one powerful inbox. AI-powered message categorization, priority sorting, and team collaboration.",
      image: "/api/placeholder/600/400",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-500",
      features: ["Unified conversations", "AI responses", "Priority sorting", "Team collaboration", "Sentiment analysis"],
      link: "/inbox"
    },
    {
      id: "calendar",
      title: "Smart Calendar - Planning",
      subtitle: "Content Scheduling",
      description: "Intelligent content calendar with optimal posting times, trend integration, bulk scheduling, and collaborative planning tools for teams.",
      image: "/api/placeholder/600/400",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      features: ["Optimal timing", "Trend integration", "Bulk scheduling", "Team planning", "Content queue"],
      link: "/calendar"
    },
    {
      id: "growth",
      title: "Growth Engine - Audience Building",
      subtitle: "Growth Strategies",
      description: "AI-driven audience growth strategies with competitor analysis, influencer discovery, hashtag optimization, and engagement tactics.",
      image: "/api/placeholder/600/400",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      features: ["Growth strategies", "Competitor analysis", "Influencer discovery", "Hashtag optimization", "Engagement tactics"],
      link: "/growth"
    }
  ]

  // Comprehensive feature sections with extensive detail
  const detailedFeatures = [
    {
      title: "VeeGPT - Advanced AI Chat Assistant & Strategic Intelligence",
      description: "Experience the next generation of AI-powered social media assistance with VeeGPT, our flagship conversational AI that combines the power of GPT-4 with specialized social media expertise. Unlike generic chatbots, VeeGPT understands your brand, analyzes your audience, and provides contextual insights that drive real business growth.",
      icon: <Bot className="w-16 h-16 text-violet-500" />,
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      image: VeeGPTInterface,
      details: [
        "Real-time streaming responses with ChatGPT-like interface optimized for social media workflows",
        "Advanced context awareness that remembers your brand voice, audience preferences, and campaign history",
        "Strategic content planning with AI-generated content calendars and campaign strategies",
        "Competitive analysis and market research capabilities with actionable insights",
        "Custom AI model training on your specific industry and audience data",
        "Multi-language support with localized content recommendations for global audiences",
        "Integration with all platform features for seamless workflow optimization",
        "Voice and text input capabilities for hands-free content creation and strategy development",
        "Advanced prompt engineering with industry-specific templates and frameworks",
        "Real-time trend analysis and viral content prediction algorithms",
        "Personalized growth strategies based on your current metrics and industry benchmarks",
        "Crisis management guidance with real-time reputation monitoring and response suggestions"
      ]
    },
    {
      title: "Cosmos AI Video Studio - Professional Video Generation Platform",
      description: "Transform your video content strategy with Cosmos, our revolutionary AI video generation engine that creates broadcast-quality videos in minutes. From concept to final edit, Cosmos handles every aspect of video production using cutting-edge AI models and professional-grade automation.",
      icon: <Video className="w-16 h-16 text-blue-500" />,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      image: VideoStudioInterface,
      details: [
        "Advanced script generation using GPT-4 with viral content optimization and storytelling frameworks",
        "Automated scene creation with AI-generated visuals, animations, and professional transitions",
        "Professional voiceover generation with 200+ realistic voices in 50+ languages and accents",
        "Smart video editing with automatic pacing, music selection, and visual effects",
        "Multi-format export optimization for all social platforms (vertical, square, horizontal)",
        "Brand asset integration with automatic logo placement and color scheme consistency",
        "Template library with 500+ pre-designed video frameworks for every industry",
        "Real-time collaboration tools for team-based video production and approval workflows",
        "Advanced AI image generation for custom scenes, backgrounds, and product visualizations",
        "Automated subtitle generation with styling options and multi-language support",
        "Performance analytics integration to optimize video content based on engagement data",
        "Custom music composition using AI with royalty-free licensing and mood-based selection",
        "Green screen replacement and advanced visual effects powered by machine learning",
        "Batch processing capabilities for creating multiple video variations from single scripts"
      ]
    },
    {
      title: "Analytics Pro - Enterprise-Grade Performance Intelligence",
      description: "Unlock the full potential of your social media data with Analytics Pro, our comprehensive business intelligence platform that transforms raw metrics into actionable growth strategies. Built for enterprises and agencies managing multiple accounts and complex campaigns.",
      icon: <BarChart3 className="w-16 h-16 text-emerald-500" />,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      image: AnalyticsInterface,
      details: [
        "Real-time dashboard with customizable widgets tracking 200+ social media metrics across all platforms",
        "Advanced audience demographics analysis with psychographic profiling and behavior prediction",
        "Comprehensive competitor intelligence with automated benchmarking and market share analysis",
        "ROI attribution modeling with multi-touch campaign attribution and conversion tracking",
        "Predictive analytics using machine learning to forecast performance and identify growth opportunities",
        "Custom report builder with 50+ templates and white-label branding for client presentations",
        "Automated alert system for performance anomalies, viral content detection, and crisis monitoring",
        "Cross-platform analytics consolidation with unified KPI tracking and goal management",
        "Advanced cohort analysis for understanding user lifecycle and retention patterns",
        "Sentiment analysis with emotion detection and brand perception monitoring",
        "Influencer performance tracking with reach, engagement, and conversion analytics",
        "Campaign performance optimization with A/B testing insights and recommendation engine",
        "Data export capabilities with API access for custom integrations and business intelligence tools",
        "Historical data analysis with trend identification and seasonal pattern recognition",
        "Team performance analytics with individual contributor metrics and productivity insights"
      ]
    },
    {
      title: "Content Studio - AI-Powered Creative Intelligence Platform",
      description: "Revolutionize your content creation process with Content Studio, our advanced AI platform that combines creativity with data-driven insights. Generate high-converting content that resonates with your audience while maintaining your unique brand voice and style.",
      icon: <Palette className="w-16 h-16 text-pink-500" />,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      image: ContentStudioInterface,
      details: [
        "Advanced content generation using multiple AI models (GPT-4, Claude, custom fine-tuned models)",
        "Brand voice training with tone analysis and consistency enforcement across all content",
        "Trend prediction engine analyzing millions of social posts to identify emerging opportunities",
        "Visual content creation with AI-generated images, graphics, and custom illustrations",
        "Content optimization engine with engagement prediction and performance scoring",
        "Industry-specific templates and frameworks for 50+ business categories and niches",
        "Multi-platform adaptation with automatic content formatting for each social network",
        "Hashtag research and optimization with trending analysis and reach prediction",
        "Content calendar integration with strategic planning and campaign coordination",
        "A/B testing framework for optimizing headlines, copy, and creative elements",
        "User-generated content curation with automated discovery and licensing assistance",
        "Content repurposing engine that transforms single ideas into multiple format variations",
        "Collaborative workspace with team editing, approval workflows, and version control",
        "Performance feedback loop that learns from your best-performing content to improve future suggestions",
        "Content compliance checking for platform guidelines and brand safety requirements"
      ]
    },


    {
      title: "Growth Engine - Advanced Audience Development Platform",
      description: "Accelerate your audience growth with our comprehensive platform that combines AI-driven strategies, competitive intelligence, and proven growth tactics to build engaged, high-value communities around your brand.",
      icon: <TrendingUp className="w-16 h-16 text-purple-500" />,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      image: AnalyticsInterface,
      details: [
        "AI-powered growth strategies customized for your industry, audience, and business objectives",
        "Comprehensive competitor analysis with strategy insights and opportunity identification",
        "Influencer discovery and relationship management with performance tracking and ROI analysis",
        "Advanced hashtag optimization with trending analysis, reach prediction, and engagement scoring",
        "Community building tools with engagement tactics and relationship nurturing automation",
        "Viral content engineering using data-driven insights and proven viral mechanics",
        "Audience targeting with psychographic profiling and lookalike audience generation",
        "Cross-platform growth coordination ensuring consistent expansion across all networks",
        "Conversion optimization tools turning followers into customers and brand advocates",
        "Reputation management with brand mention monitoring and sentiment tracking",
        "Partnership opportunity identification with collaboration potential scoring",
        "Content amplification strategies maximizing reach through strategic timing and targeting",
        "Growth experiment framework with A/B testing and performance optimization",
        "Market expansion analysis identifying new audience segments and geographic opportunities",
        "Long-term growth planning with milestone tracking and strategic roadmap development"
      ]
    }
  ]



  // Industry-specific solutions
  const revolutionaryIndustrySolutions = [
    {
      industry: "E-commerce & Retail",
      subtitle: "Revenue Acceleration Engine",
      description: "Next-generation AI-powered commerce platform with predictive analytics and real-time optimization.",
      icon: <ShoppingCart className="w-16 h-16" />,
      gradientFrom: "from-blue-600",
      gradientTo: "to-cyan-400",
      hoverColor: "hover:from-blue-700 hover:to-cyan-500",
      particles: ["💎", "🛍️", "📊"],
      metrics: { growth: "+347%", conversion: "8.2%", roi: "12.4x" },
      features: [
        "🧠 AI-Powered Product Recommendation Engine",
        "🎯 Dynamic Pricing & Inventory Optimization", 
        "🚀 Automated Cross-Platform Sales Funnels",
        "📈 Real-Time Customer Journey Analytics",
        "🤖 Conversational Commerce AI Assistant",
        "🎨 Auto-Generated Product Visual Content",
        "🔮 Predictive Demand Forecasting",
        "💫 Personalized Shopping Experience Creator"
      ],
      liveDemo: true,
      aiPowered: true,
      trending: true
    },
    {
      industry: "Healthcare & Wellness",
      subtitle: "Digital Health Revolution",
      description: "HIPAA-compliant AI health platform with advanced patient engagement and medical content automation.",
      icon: <Heart className="w-16 h-16" />,
      gradientFrom: "from-red-500",
      gradientTo: "to-pink-400",
      hoverColor: "hover:from-red-600 hover:to-pink-500",
      particles: ["💊", "🩺", "❤️"],
      metrics: { engagement: "+285%", compliance: "100%", satisfaction: "9.7/10" },
      features: [
        "🏥 HIPAA-Compliant AI Content Generator",
        "📋 Automated Patient Education Workflows",
        "🔬 Medical Research Integration & Insights",
        "📱 Telehealth Appointment Automation",
        "🎯 Personalized Health Journey Mapping",
        "📊 Population Health Analytics Dashboard",
        "🤝 Provider-Patient Communication Hub",
        "🛡️ Advanced Privacy & Security Controls"
      ],
      liveDemo: true,
      aiPowered: true,
      secure: true
    },
    {
      industry: "Professional Services",
      subtitle: "Authority & Influence Platform",
      description: "Executive-grade thought leadership platform with AI-powered reputation management and client acquisition.",
      icon: <Building2 className="w-16 h-16" />,
      gradientFrom: "from-slate-600",
      gradientTo: "to-gray-400",
      hoverColor: "hover:from-slate-700 hover:to-gray-500",
      particles: ["🏆", "📈", "💼"],
      metrics: { authority: "+425%", leads: "+298%", revenue: "+185%" },
      features: [
        "🎖️ AI-Powered Thought Leadership Engine",
        "🎯 Intelligent Lead Scoring & Nurturing",
        "📚 Industry Expertise Content Library",
        "🤝 Client Success Story Automation",
        "🎤 Speaking Engagement Opportunity Finder",
        "📊 Professional Network Growth Analytics",
        "🔍 Competitive Intelligence Dashboard",
        "💡 Strategic Market Positioning Tools"
      ],
      liveDemo: true,
      aiPowered: true,
      premium: true
    },
    {
      industry: "Technology & SaaS",
      subtitle: "Developer-First Growth Engine",
      description: "Cutting-edge developer-focused platform with automated technical content and community building.",
      icon: <Cpu className="w-16 h-16" />,
      gradientFrom: "from-violet-600",
      gradientTo: "to-purple-400",
      hoverColor: "hover:from-violet-700 hover:to-purple-500",
      particles: ["🚀", "💻", "⚡"],
      metrics: { adoption: "+445%", community: "50K+", deployments: "1M+" },
      features: [
        "👨‍💻 AI Code Documentation Generator",
        "🎯 Developer Community Engagement Automation",
        "📦 API Integration & Webhook Management",
        "🔄 Automated Release Notes & Changelogs",
        "🧪 Beta Testing Program Management",
        "📊 Feature Adoption Analytics & Insights",
        "🤖 Technical Support Chatbot Integration",
        "🌐 Multi-Platform Developer Outreach"
      ],
      liveDemo: true,
      aiPowered: true,
      trending: true
    }
  ]

  // Pricing tiers with detailed features
  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual creators and small businesses getting started with AI-powered social media management.",
      features: [
        "VeeGPT AI Assistant with 100 conversations/month",
        "Basic content generation (50 posts/month)",
        "2 social media accounts",
        "Basic analytics and reporting",
        "Email support",
        "Content calendar for 1 month ahead",
        "Basic automation rules (5 active rules)",
        "Standard video generation (10 videos/month)"
      ],
      buttonText: "Start Free Trial",
      popular: false,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses, agencies, and serious content creators who need advanced features and higher limits.",
      features: [
        "Unlimited VeeGPT conversations",
        "Advanced content generation (500 posts/month)",
        "10 social media accounts",
        "Advanced analytics with competitor insights",
        "Priority support + dedicated account manager",
        "Content calendar for 3 months ahead",
        "Advanced automation rules (50 active rules)",
        "Professional video generation (100 videos/month)",
        "Team collaboration (5 team members)",
        "White-label reporting",
        "API access",
        "Custom integrations"
      ],
      buttonText: "Start Professional",
      popular: true,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations, agencies, and enterprises requiring maximum capabilities, unlimited usage, and custom solutions.",
      features: [
        "Unlimited everything - VeeGPT, content, videos",
        "Unlimited social media accounts",
        "Enterprise analytics with custom dashboards",
        "24/7 premium support + dedicated success manager",
        "Unlimited content planning and scheduling",
        "Unlimited automation rules and workflows",
        "Custom AI model training on your data",
        "Unlimited team members and workspaces",
        "Full white-label solutions",
        "Custom API development",
        "On-premise deployment options",
        "Advanced security and compliance features",
        "Custom integrations and workflows",
        "Dedicated infrastructure and priority processing"
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "from-gold-500 to-yellow-600"
    }
  ]

  // Testimonials from satisfied users
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Social Media Manager at TechCorp",
      avatar: "/api/placeholder/60/60",
      content: "VeeFore transformed our social media strategy completely. The AI content generation saves us 20+ hours per week, and our engagement rates have increased by 300%. The video generation feature is absolutely game-changing!",
      rating: 5,
      company: "TechCorp"
    },
    {
      name: "Marcus Chen",
      role: "Digital Marketing Agency Owner",
      avatar: "/api/placeholder/60/60",
      content: "As an agency managing 50+ client accounts, VeeFore's automation and analytics features are essential. The unified inbox alone saves us countless hours, and clients love the detailed reporting and professional video content we can now produce.",
      rating: 5,
      company: "Chen Digital"
    },
    {
      name: "Emma Rodriguez",
      role: "E-commerce Brand Manager",
      avatar: "/api/placeholder/60/60",
      content: "The ROI from VeeFore is incredible. Our social media-driven sales increased by 250% in just 3 months. The AI understands our brand voice perfectly, and the automated customer service responses maintain our quality standards 24/7.",
      rating: 5,
      company: "Fashion Forward"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient mesh */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 opacity-5">
          <div 
            className="w-full h-full border border-violet-300/40 rounded-3xl animate-spin"
            style={{ animationDuration: '20s' }}
          />
        </div>
        <div className="absolute top-40 right-32 w-24 h-24 opacity-5">
          <div 
            className="w-full h-full border border-blue-300/40 rounded-full animate-pulse"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <div className="absolute bottom-32 left-40 w-20 h-20 opacity-5">
          <Triangle 
            className="w-full h-full text-emerald-300/40 animate-bounce"
            style={{ animationDuration: '4s' }}
          />
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Navigation - Professional Light Design */}
      <nav className="fixed top-0 w-full z-50">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  VeeFore
                </span>
                <span className="text-xs text-gray-500 -mt-1">AI Platform</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-10">
              {['Features', 'Platform', 'Pricing', 'Solutions'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group text-sm font-medium"
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                className="hidden sm:flex border border-gray-300 text-gray-700 hover:bg-gray-50 backdrop-blur-sm px-6 py-2.5 rounded-xl font-medium transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => handleNavigation('veegpt')}
                className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/25 transition-all duration-300 group"
              >
                <span className="relative z-10">Try VeeGPT</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section - World-Class Premium Design */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Revolutionary Background System */}
        <div className="absolute inset-0">
          {/* Dynamic Neural Network Grid */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              <defs>
                <pattern id="neural-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="1" fill="currentColor" className="text-violet-600">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="6s" repeatCount="indefinite" />
                  </circle>
                  <line x1="25" y1="25" x2="75" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-blue-600" opacity="0.2">
                    <animate attributeName="opacity" values="0.1;0.5;0.1" dur="8s" repeatCount="indefinite" />
                  </line>
                  <line x1="25" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-emerald-600" opacity="0.2">
                    <animate attributeName="opacity" values="0.1;0.5;0.1" dur="7s" repeatCount="indefinite" begin="2s" />
                  </line>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural-grid)" />
            </svg>
          </div>

          {/* Advanced Morphing Gradient Orbs */}
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-purple-600/8 to-blue-600/6 rounded-full blur-3xl animate-morph-1" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/8 via-cyan-600/10 to-emerald-600/6 rounded-full blur-3xl animate-morph-2" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-600/6 via-teal-600/8 to-cyan-600/5 rounded-full blur-3xl animate-morph-3 transform -translate-x-1/2 -translate-y-1/2" />
          
          {/* Premium Light Rays */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-violet-600/20 via-transparent to-transparent transform -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent transform -translate-y-1/2" />
          
          {/* Floating Geometric Elements */}
          <div className="absolute top-32 left-1/4 w-24 h-24 border border-violet-300/20 rounded-2xl rotate-45 animate-slow-float" />
          <div className="absolute bottom-40 right-1/3 w-16 h-16 border border-blue-300/20 rounded-full animate-slow-pulse" />
          <div className="absolute top-2/3 left-1/6 w-20 h-20 border border-emerald-300/20 rounded-xl rotate-12 animate-slow-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Ultra-Premium Status Badge */}
          <div className="inline-flex items-center mb-12 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-full blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-3xl border border-gray-200/60 rounded-full px-10 py-5 flex items-center space-x-4 shadow-2xl group-hover:shadow-violet-500/20 transition-all duration-700">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-20" />
                </div>
                <span className="text-gray-800 font-semibold text-base tracking-wide">
                  Now Available • Revolutionary AI Platform
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* World-Class Typography System */}
          <div className="space-y-8 mb-16">
            <div className="relative">
              {/* Text Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-blue-600/5 to-emerald-600/5 blur-3xl scale-110" />
              
              <h1 className="relative text-6xl sm:text-7xl lg:text-9xl xl:text-[10rem] font-black tracking-[-0.02em] leading-[0.85]">
                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                  The Future of
                </span>
                <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] mb-4">
                  Social Media
                </span>
                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  is Here
                </span>
              </h1>
              
              {/* Subtitle with Premium Styling */}
              <div className="mt-12 max-w-5xl mx-auto">
                <p className="text-2xl lg:text-3xl text-gray-600 leading-relaxed font-light tracking-wide">
                  Experience the next generation of 
                  <span className="relative mx-2">
                    <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                      AI-powered social media management.
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-600 to-blue-600 opacity-30" />
                  </span>
                  From intelligent chat assistance to professional video generation, VeeFore transforms how you create, manage, and grow your digital presence.
                </p>
              </div>
            </div>
          </div>

          {/* Premium CTA System */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
            <Button 
              onClick={() => handleNavigation('veegpt')}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:via-purple-500 hover:to-blue-500 text-white px-16 py-6 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-violet-500/30 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center space-x-4">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span>Experience VeeGPT</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="group border-2 border-gray-300 bg-white/80 backdrop-blur-3xl text-gray-800 hover:bg-white hover:border-gray-400 px-16 py-6 text-xl font-bold rounded-3xl transition-all duration-700 shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Play className="w-4 h-4 fill-gray-700 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </div>
            </Button>
          </div>

          {/* Revolutionary 3D Platform Preview */}
          <div className="relative max-w-8xl mx-auto perspective-1000">
            <div className="relative transform rotate-x-12 hover:rotate-x-6 transition-transform duration-1000">
              {/* Premium Device Frame */}
              <div className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Screen Reflection */}
                <div className="absolute inset-3 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-[2.5rem] pointer-events-none" />
                
                {/* Device Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 rounded-t-[2.5rem] border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg" />
                        <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg" />
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg" />
                      </div>
                      <div className="text-white/80 text-lg font-semibold">VeeFore AI Platform</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white/60 text-sm">Live Preview</span>
                    </div>
                  </div>
                </div>
                
                {/* Compact Platform Interface */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-b-[2.5rem] min-h-[400px]">
                  {/* Compact Platform Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-white">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-bold text-base">VeeFore Dashboard</h3>
                        <p className="text-gray-500 text-xs">Live Platform Preview • {currentTime.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-600 text-xs font-medium">Online</span>
                    </div>
                  </div>

                  {/* Compact Feature Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {platformFeatures.slice(0, 4).map((feature, index) => (
                      <div 
                        key={feature.id}
                        onClick={() => {
                          setSelectedFeature(index)
                          handleNavigation(feature.link.substring(1))
                        }}
                        onMouseEnter={() => setSelectedFeature(index)}
                        onMouseLeave={() => setSelectedFeature(null)}
                        className={`group relative bg-white rounded-xl p-4 shadow-md hover:shadow-lg border transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                          selectedFeature === index 
                            ? 'border-violet-200 shadow-violet-100/50 scale-105' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {/* Compact Feature Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            {feature.icon}
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-500">Live</span>
                          </div>
                        </div>
                        
                        <h3 className="text-gray-900 font-bold text-sm mb-1">{feature.title.split(' ')[0]}</h3>
                        <p className="text-gray-600 text-xs mb-3">{feature.subtitle}</p>
                        
                        {/* Compact Activity Indicator */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Activity</span>
                            <span className="text-gray-700 font-medium">
                              {index === 0 && `${Math.floor(liveStats.conversations / 100)}%`}
                              {index === 1 && `${Math.floor(liveStats.contentGenerated / 50)}`}
                              {index === 2 && `${Math.floor(liveStats.analyticsViews / 40)}`}
                              {index === 3 && `${Math.floor(liveStats.activeUsers / 20)}`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full bg-gradient-to-r ${feature.color} transition-all duration-1000`}
                              style={{ 
                                width: `${45 + (index * 15) + Math.sin(Date.now() / 2000 + index) * 10}%` 
                              }}
                            />
                          </div>
                        </div>

                        {/* Compact Action Button */}
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className={`w-full py-1.5 px-3 rounded-lg bg-gradient-to-r ${feature.color} text-white text-xs font-medium hover:shadow-md transition-all duration-300`}>
                            Launch
                          </button>
                        </div>
                        
                        {/* Selected Feature Highlight */}
                        {selectedFeature === index && (
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-blue-600/5 to-emerald-600/5 rounded-2xl" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Compact Analytics Dashboard */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gray-900 font-bold text-sm">Real-Time Analytics</h4>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span className="text-green-600 text-xs font-medium">Live</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { 
                          label: 'AI Conversations', 
                          value: liveStats.conversations.toLocaleString(), 
                          trend: '+12%', 
                          color: 'text-violet-600',
                          bgColor: 'bg-violet-50'
                        },
                        { 
                          label: 'Content Generated', 
                          value: liveStats.contentGenerated.toLocaleString(), 
                          trend: '+24%', 
                          color: 'text-blue-600',
                          bgColor: 'bg-blue-50'
                        },
                        { 
                          label: 'Analytics Views', 
                          value: liveStats.analyticsViews.toLocaleString(), 
                          trend: '+8%', 
                          color: 'text-emerald-600',
                          bgColor: 'bg-emerald-50'
                        },
                        { 
                          label: 'Active Users', 
                          value: liveStats.activeUsers.toLocaleString(), 
                          trend: '+15%', 
                          color: 'text-pink-600',
                          bgColor: 'bg-pink-50'
                        }
                      ].map((stat, index) => (
                        <div key={index} className={`${stat.bgColor} rounded-lg p-3 border border-white/50`}>
                          <div className="text-lg font-bold text-gray-900 mb-1">{stat.value}</div>
                          <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                          <div className={`text-xs font-semibold ${stat.color} flex items-center space-x-1`}>
                            <TrendingUp className="w-2 h-2" />
                            <span>{stat.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  
                  {/* Advanced Interactive Demo Controls */}
                  <div className="mt-8 space-y-6">
                    {/* Live Activity Feed */}
                    <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-gray-700 text-sm font-bold">Live Platform Activity</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setPreviewMode('overview')}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                              previewMode === 'overview' 
                                ? 'bg-violet-600 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Overview
                          </button>
                          <button 
                            onClick={() => setPreviewMode('detailed')}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                              previewMode === 'detailed' 
                                ? 'bg-violet-600 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Detailed
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: 'AI Conversations', value: '2,847', trend: '+12%', color: 'text-violet-600' },
                          { label: 'Content Generated', value: '1,203', trend: '+24%', color: 'text-blue-600' },
                          { label: 'Analytics Views', value: '856', trend: '+8%', color: 'text-emerald-600' },
                          { label: 'Active Users', value: '342', trend: '+15%', color: 'text-pink-600' }
                        ].map((stat, index) => (
                          <div key={index} className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                            <div className={`text-xs font-semibold ${stat.color}`}>{stat.trend}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Interactive Action Center */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => handleNavigation('veegpt')}
                        className="group bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <Bot className="w-5 h-5" />
                          <span>Start with VeeGPT</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => setIsInteractionActive(!isInteractionActive)}
                        className="group border-2 border-gray-300 bg-white/80 backdrop-blur-xl text-gray-800 hover:bg-white hover:border-gray-400 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <MousePointer2 className="w-5 h-5" />
                          <span>{isInteractionActive ? 'Exit Demo Mode' : 'Interactive Demo'}</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* Advanced Compact Interactive Demo */}
                    {isInteractionActive && (
                      <div className="bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 backdrop-blur-xl border border-violet-200 rounded-3xl p-6 shadow-2xl max-h-[500px] overflow-hidden">
                        {/* Compact Demo Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                              <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-gray-900 font-bold text-lg">Interactive Demo Mode Active</h4>
                              <p className="text-gray-600 text-xs">Experience VeeFore's revolutionary AI platform in real-time</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-600 font-medium text-xs">Live Demo</span>
                          </div>
                        </div>

                        {/* Main App Screenshot/Demo Area */}
                        <div className="bg-black/90 rounded-xl p-4 mb-6 border border-gray-200/20">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex space-x-1.5">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="bg-gray-800 rounded-lg px-3 py-1 flex-1">
                              <span className="text-gray-400 text-xs">https://veefore.com/{platformFeatures[activeFeature].link.substring(1)}</span>
                            </div>
                          </div>
                          
                          {/* App Interface Preview */}
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 h-48 relative overflow-hidden">
                            {/* VeeGPT Interface Preview */}
                            {activeFeature === 0 && (
                              <div className="h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                      <MessageSquare className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900">VeeGPT Chat</span>
                                  </div>
                                  <div className="text-xs text-gray-500">AI Assistant Active</div>
                                </div>
                                
                                <div className="space-y-3 h-32 overflow-hidden">
                                  <div className="flex space-x-2">
                                    <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-2 flex-1">
                                      <div className="text-xs text-gray-700">Create a social media strategy for my tech startup</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Bot className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-2 flex-1">
                                      <div className="text-xs text-gray-700">I'll help you create a comprehensive social media strategy...</div>
                                      <div className="w-16 h-1 bg-blue-200 rounded mt-1 animate-pulse"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="absolute bottom-2 left-4 right-4">
                                  <div className="bg-white border border-gray-200 rounded-lg p-2 flex items-center space-x-2">
                                    <div className="text-xs text-gray-400 flex-1">Type your message...</div>
                                    <Send className="w-3 h-3 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* AI Generation Interface */}
                            {activeFeature === 1 && (
                              <div className="h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                      <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900">AI Content Studio</span>
                                  </div>
                                  <div className="text-xs text-green-600 flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Generating</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 h-32">
                                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3">
                                    <div className="text-xs font-medium text-gray-700 mb-2">Post Caption</div>
                                    <div className="space-y-1">
                                      <div className="w-full h-1 bg-purple-200 rounded"></div>
                                      <div className="w-3/4 h-1 bg-purple-200 rounded"></div>
                                      <div className="w-5/6 h-1 bg-purple-200 rounded animate-pulse"></div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-3">
                                    <div className="text-xs font-medium text-gray-700 mb-2">Visual Content</div>
                                    <div className="w-full h-16 bg-gradient-to-br from-blue-200 to-cyan-200 rounded flex items-center justify-center">
                                      <Image className="w-6 h-6 text-blue-600" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Analytics Dashboard */}
                            {activeFeature === 2 && (
                              <div className="h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                      <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900">Analytics Dashboard</span>
                                  </div>
                                  <div className="text-xs text-gray-500">Real-time Data</div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  <div className="bg-green-50 rounded p-2 text-center">
                                    <div className="text-xs text-green-600 font-medium">Engagement</div>
                                    <div className="text-sm font-bold text-green-700">+23%</div>
                                  </div>
                                  <div className="bg-blue-50 rounded p-2 text-center">
                                    <div className="text-xs text-blue-600 font-medium">Reach</div>
                                    <div className="text-sm font-bold text-blue-700">12.5K</div>
                                  </div>
                                  <div className="bg-purple-50 rounded p-2 text-center">
                                    <div className="text-xs text-purple-600 font-medium">Posts</div>
                                    <div className="text-sm font-bold text-purple-700">48</div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-2 h-20 flex items-end space-x-1">
                                  {[20, 35, 25, 45, 30, 55, 40, 60, 35, 50].map((height, i) => (
                                    <div 
                                      key={i} 
                                      className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-sm flex-1 transition-all duration-1000"
                                      style={{ height: `${height}%` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Content Calendar */}
                            {activeFeature === 3 && (
                              <div className="h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                      <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-900">Content Calendar</span>
                                  </div>
                                  <div className="text-xs text-gray-500">August 2025</div>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-1 h-32">
                                  {Array.from({ length: 21 }, (_, i) => (
                                    <div key={i} className="bg-gray-50 rounded text-xs p-1 relative">
                                      <div className="text-gray-500 text-xs">{i + 1}</div>
                                      {[2, 5, 8, 12, 15, 18].includes(i) && (
                                        <div className="w-1 h-1 bg-violet-500 rounded-full absolute bottom-1 right-1"></div>
                                      )}
                                      {[3, 9, 16].includes(i) && (
                                        <div className="w-1 h-1 bg-green-500 rounded-full absolute bottom-1 right-1"></div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Innovative Feature Grid with Hover Previews */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative">
                          {platformFeatures.slice(0, 4).map((feature, index) => (
                            <div key={feature.id} className="relative group">
                              <button
                                onClick={() => {
                                  setActiveFeature(index)
                                  handleNavigation(feature.link.substring(1))
                                }}
                                onMouseEnter={() => setSelectedFeature(index)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 ${
                                  activeFeature === index
                                    ? `border-violet-300 bg-gradient-to-br ${feature.color.replace('from-', 'from-').replace('to-', 'to-')}/10 shadow-xl`
                                    : 'border-gray-200 bg-white/70 hover:border-violet-200 hover:shadow-lg'
                                }`}
                              >
                                <div className="flex flex-col items-center text-center space-y-3">
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                  </div>
                                  <div>
                                    <h3 className="text-gray-900 font-bold text-sm mb-1">{feature.title.split(' ')[0]}</h3>
                                    <p className="text-gray-600 text-xs">{feature.subtitle}</p>
                                  </div>
                                  {activeFeature === index && (
                                    <div className="flex items-center space-x-1 text-violet-600 text-xs font-medium">
                                      <Play className="w-3 h-3" />
                                      <span>Active</span>
                                    </div>
                                  )}
                                </div>
                              </button>

                              {/* Advanced Hover Preview */}
                              {selectedFeature === index && selectedFeature !== activeFeature && (
                                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-2 shadow-xl overflow-hidden">
                                  <div className="text-left h-full flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-gray-900 font-semibold text-xs mb-1 line-clamp-1">{feature.title}</h5>
                                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{feature.description}</p>
                                      <div className="space-y-0.5">
                                        {feature.features.slice(0, 2).map((item, i) => (
                                          <div key={i} className="flex items-center space-x-1 text-xs text-gray-700">
                                            <div className="w-1 h-1 bg-violet-500 rounded-full flex-shrink-0" />
                                            <span className="line-clamp-1 text-xs">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <button className={`mt-2 px-2 py-1 rounded-md bg-gradient-to-r ${feature.color} text-white text-xs font-medium hover:shadow-lg transition-all`}>
                                      Try {feature.title.split(' ')[0]}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Compact Smart Instructions */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                              <div>
                                <h5 className="text-gray-900 font-semibold text-sm">Explore Features</h5>
                                <p className="text-gray-600 text-xs">Click any feature card to launch and experience the actual platform functionality</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                              <div>
                                <h5 className="text-gray-900 font-semibold text-sm">Real-time Interaction</h5>
                                <p className="text-gray-600 text-xs">All demo elements are fully interactive with live data and responsive animations</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                              <div>
                                <h5 className="text-gray-900 font-semibold text-sm">Experience Power</h5>
                                <p className="text-gray-600 text-xs">See how VeeFore revolutionizes social media management with AI</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Innovative Quick Access Bar */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600 text-xs font-medium">Quick Access:</span>
                            {platformFeatures.slice(0, 4).map((feature, index) => (
                              <button
                                key={feature.id}
                                onClick={() => {
                                  setActiveFeature(index)
                                  handleNavigation(feature.link.substring(1))
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                  activeFeature === index
                                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {feature.title.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600 text-xs font-medium">Enhanced Mode</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Status Indicator */}
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/80 backdrop-blur-3xl border border-white/20 rounded-3xl px-10 py-6 shadow-2xl group cursor-pointer hover:bg-black/90 transition-all duration-500">
                  <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${platformFeatures[activeFeature].color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      {platformFeatures[activeFeature].icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-lg">{platformFeatures[activeFeature].title}</div>
                      <div className="text-gray-400 text-sm">{platformFeatures[activeFeature].subtitle}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <button 
                        onClick={() => handleNavigation(platformFeatures[activeFeature].link.substring(1))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-white text-sm font-medium"
                      >
                        Try Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-4 animate-bounce">
              <div className="text-gray-500 text-sm font-medium">Explore More</div>
              <div className="w-8 h-12 border-2 border-gray-300 rounded-full flex justify-center">
                <div className="w-1.5 h-4 bg-gradient-to-b from-violet-600 to-blue-600 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next-Generation Advanced Platform Features */}
      <section id="platform" className="relative py-32 px-6 lg:px-8 overflow-hidden">
        {/* Ultra-Advanced Background System */}
        <div className="absolute inset-0">
          {/* Neural Network Mesh */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              <defs>
                <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.3">
                    <animate attributeName="opacity" values="0.1;0.8;0.1" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="25" cy="25" r="0.5" fill="currentColor" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.6;0.05" dur="6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="75" cy="75" r="0.5" fill="currentColor" opacity="0.2">
                    <animate attributeName="opacity" values="0.05;0.6;0.05" dur="5s" repeatCount="indefinite" />
                  </circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural-grid)" className="text-violet-600" />
            </svg>
          </div>
          
          {/* Dynamic Gradient Orbs with Premium Animations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 animate-morph-premium-1" style={{
              background: 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)',
              filter: 'blur(60px)',
            }} />
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-15 animate-morph-premium-2" style={{
              background: 'conic-gradient(from 90deg, #f59e0b, #ef4444, #8b5cf6, #f59e0b)',
              filter: 'blur(50px)',
            }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 animate-morph-premium-1" style={{
              background: 'conic-gradient(from 180deg, #06b6d4, #8b5cf6, #10b981, #06b6d4)',
              filter: 'blur(40px)',
            }} />
          </div>
        </div>

        <div className="relative max-w-8xl mx-auto">
          {/* Ultra-Modern Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-r from-gray-50 to-white backdrop-blur-xl border border-gray-200/50 rounded-full px-8 py-3 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent uppercase tracking-wider">
                    Next-Gen Platform
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                Redefining
              </span>
              <span className="block">
                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Intelligence
                </span>
              </span>
            </h2>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed mb-8">
              Experience the future of AI-powered creativity with breakthrough technologies that adapt, learn, and evolve with your workflow.
            </p>
          </div>

          {/* Revolutionary Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8 min-h-[800px]">
            
            {/* Primary Feature - Large Hero Card */}
            <div className="col-span-12 lg:col-span-8 group">
              <div className="relative h-full min-h-[500px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/30 to-blue-600/20 animate-gradient-shift" />
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full animate-slow-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 2}s`,
                          animationDuration: `${12 + Math.random() * 8}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="relative h-full flex flex-col lg:flex-row">
                  {/* Content Section */}
                  <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-lg">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                          <div className="text-white text-xl">
                            {platformFeatures[0].icon}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/60 text-xs font-bold uppercase tracking-wider">
                            {platformFeatures[0].subtitle}
                          </div>
                          <div className="text-white text-sm font-medium">
                            Next-Generation AI
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        {detailedFeatures[0].title.split(' - ')[0]}
                      </h3>
                      <p className="text-white/80 text-lg lg:text-xl font-light leading-relaxed mb-8">
                        {detailedFeatures[0].description}
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        {detailedFeatures[0].details.slice(0, 3).map((detail, idx) => (
                          <div key={idx} className="flex items-center space-x-3 text-white/90">
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                            <span className="text-sm font-medium">{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => handleNavigation('veegpt')}
                        className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <span className="relative z-10">Experience VeeGPT</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Interactive Visual */}
                  <div className="flex-1 relative p-8 lg:p-12 flex items-center justify-center">
                    <div className="relative group-hover:scale-105 transition-transform duration-700">
                      {/* Main Interface Mockup */}
                      <div className="w-80 h-96 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 overflow-hidden shadow-2xl">
                        <div className="h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                            <div className="w-3 h-3 bg-green-400 rounded-full" />
                          </div>
                          <div className="text-white/60 text-xs font-medium">VeeGPT</div>
                        </div>
                        <div className="p-6 space-y-4">
                          {/* Animated Chat Bubbles */}
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
                              <span className="text-white/80 text-xs">VeeGPT</span>
                            </div>
                            <div className="text-white/70 text-sm">
                              <div className="animate-typing">How can I help you create amazing content today?</div>
                            </div>
                          </div>
                          
                          <div className="bg-violet-500/20 rounded-2xl p-4 border border-violet-400/20 ml-8">
                            <div className="text-white/90 text-sm">
                              Generate a viral TikTok script about AI
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse" />
                              <span className="text-white/80 text-xs">VeeGPT</span>
                            </div>
                            <div className="text-white/70 text-sm">
                              <div className="animate-pulse">Creating your viral script...</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating Action Cards with Real Interface Preview */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-float-premium shadow-xl overflow-hidden">
                        <img 
                          src="attached_assets/generated_images/VeeGPT_AI_Chat_Interface_9461d5ae.png"
                          alt="VeeGPT Preview"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-float-delayed-premium shadow-xl">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Feature - Tall Card */}
            <div className="col-span-12 lg:col-span-4 group">
              <div className="h-full min-h-[500px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                <div className="relative h-full p-8 flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-white text-2xl">
                        {detailedFeatures[1].icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                        AI Video Studio
                      </div>
                      <div className="text-white text-lg font-bold">
                        {detailedFeatures[1].title.split(' - ')[0]}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      {detailedFeatures[1].description.substring(0, 200)}...
                    </p>
                    
                    {/* Apple-style Feature Cards */}
                    <div className="space-y-3 mb-8">
                      {[
                        { label: "AI Script Generation", value: "95%" },
                        { label: "Professional Voiceover", value: "92%" },
                        { label: "Scene Creation", value: "88%" }
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                          <span className="text-white/90 text-sm font-medium">{metric.label}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000"
                                style={{ width: metric.value }}
                              />
                            </div>
                            <span className="text-white/70 text-xs font-medium w-8">{metric.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>Explore Video Studio</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
                
                {/* Ambient Graphics with Apple-style floating elements */}
                <div className="absolute top-8 right-8 opacity-20">
                  <div className="w-32 h-32 border-2 border-white/30 rounded-full animate-morph-premium-1" />
                </div>
                <div className="absolute bottom-12 left-8 opacity-15">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-2xl animate-float-premium" />
                </div>
                
                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full animate-particles-float"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 1.5}s`,
                      animationDuration: `${8 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tertiary Features - Wide Cards with Premium Design */}
            <div className="col-span-12 lg:col-span-6 group">
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl relative card-premium">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-shift" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="text-white text-xl">
                          {detailedFeatures[2].icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                          Analytics Pro
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          {detailedFeatures[2].title.split(' - ')[0]}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {detailedFeatures[2].description.substring(0, 150)}...
                    </p>
                    
                    {/* Apple-style Statistics */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { label: "Metrics", value: "200+" },
                        { label: "Platforms", value: "15+" },
                        { label: "Reports", value: "50+" },
                        { label: "Accuracy", value: "99%" }
                      ].map((stat, idx) => (
                        <div key={idx} className="glass-premium rounded-xl p-3 text-center">
                          <div className="text-white font-bold text-lg">{stat.value}</div>
                          <div className="text-white/70 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="button-premium bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                        <span>View Analytics</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="text-white/60 text-sm">Real-time insights</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative hidden lg:block">
                    {/* Mini Chart Visualization */}
                    <div className="w-full h-32 relative">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bottom-0 bg-gradient-to-t from-white/60 to-white/20 rounded-t-lg animate-slow-pulse"
                          style={{
                            left: `${i * 12}%`,
                            width: '8%',
                            height: `${30 + Math.random() * 70}%`,
                            animationDelay: `${i * 1.5}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 group">
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 shadow-2xl relative card-premium">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent animate-gradient-shift" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <div className="text-white text-xl">
                          {detailedFeatures[3].icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                          Content Studio
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          {detailedFeatures[3].title.split(' - ')[0]}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {detailedFeatures[3].description.substring(0, 150)}...
                    </p>
                    
                    {/* Creative workflow steps */}
                    <div className="space-y-2 mb-6">
                      {[
                        "AI Content Generation",
                        "Visual Enhancement",
                        "Multi-platform Publishing"
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                            <span className="text-white/90 text-xs font-bold">{idx + 1}</span>
                          </div>
                          <span className="text-white/80 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="button-premium bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                        <span>Create Content</span>
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <div className="text-white/60 text-sm">AI-powered</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative hidden lg:flex items-center justify-center">
                    {/* Apple-style Creative Visual */}
                    <div className="relative">
                      <div className="w-32 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
                        <img 
                          src="attached_assets/generated_images/Content_Studio_Interface_840b3ab8.png"
                          alt="Content Studio Interface"
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-float-premium">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center animate-float-delayed-premium">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Comprehensive Features Section - Professional Light */}
      <section id="features" className="relative py-32 px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Section Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
            <div className="w-full h-full rounded-full blur-3xl" style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 100%)'
            }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="inline-flex items-center mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-xl" />
                <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-full px-8 py-4 flex items-center space-x-3 shadow-lg">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Advanced Platform Features</span>
                  <Sparkle className="w-4 h-4 text-pink-600 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-none">
              <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Enterprise-Grade
              </span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto font-light leading-relaxed">
              Comprehensive breakdown of every advanced feature that makes VeeFore the most sophisticated, 
              <span className="text-gray-900 font-semibold"> AI-powered social media management platform</span> for modern businesses and agencies.
            </p>
          </div>

          <div className="space-y-32">
            {detailedFeatures.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20`}>
                {/* Visual Section */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-20 blur-3xl scale-110`}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                      <div className="p-8 text-center">
                        <div className="mb-8">
                          {feature.icon}
                        </div>
                        <div className="mb-6">
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-72 object-cover rounded-2xl shadow-lg"
                          />
                        </div>
                        <div className={`h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2">
                  <div className="mb-6">
                    <div className={`inline-flex items-center bg-gradient-to-r ${feature.gradient} bg-opacity-10 rounded-full px-4 py-2 mb-4`}>
                      <span className="text-sm font-semibold text-gray-700">Feature #{index + 1}</span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-bold text-gray-900">Key Capabilities & Benefits</h4>
                      <Button
                        onClick={() => toggleSection(`feature-${index}`)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                      >
                        {expandedSections[`feature-${index}`] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show More
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`grid grid-cols-1 gap-5 transition-all duration-500 overflow-hidden ${
                      expandedSections[`feature-${index}`] ? 'max-h-none opacity-100' : 'max-h-32 opacity-80'
                    }`}>
                      {feature.details.slice(0, expandedSections[`feature-${index}`] ? feature.details.length : 3).map((detail, idx) => (
                        <div key={idx} className="flex items-start group">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="ml-4 text-gray-700 leading-relaxed font-medium">{detail}</span>
                        </div>
                      ))}
                      {!expandedSections[`feature-${index}`] && feature.details.length > 3 && (
                        <div className="text-center pt-4">
                          <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                            +{feature.details.length - 3} more capabilities
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-10">
                    <Button 
                      className={`bg-gradient-to-r ${feature.gradient} text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
                    >
                      Explore {feature.title.split(' ')[0]} Features
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Enterprise Security Section - Apple Premium Design */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Security Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-morph-premium-1" style={{
            background: 'radial-gradient(circle, #3b82f6, #1d4ed8, #1e40af)',
            filter: 'blur(40px)',
          }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-8 animate-morph-premium-2" style={{
            background: 'radial-gradient(circle, #10b981, #059669, #047857)',
            filter: 'blur(60px)',
          }} />
          
          {/* Neural Security Grid */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="security-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#security-grid)" className="text-blue-600" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Revolutionary Header with Apple-style Animation */}
          <div className="text-center mb-24">
            <div className="relative inline-flex items-center mb-8">
              <div className="glass-premium rounded-full px-8 py-4 backdrop-blur-xl border border-white/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center animate-float-premium">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold tracking-wide">Enterprise Security & Compliance</span>
                </div>
              </div>
              
              {/* Floating Security Icons */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-float-delayed-premium shadow-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-float-premium shadow-xl">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent">
                Bank-Level Security
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive enterprise-grade security with advanced compliance features for organizations managing sensitive client data and high-stakes social media operations.
            </p>
          </div>

          {/* Revolutionary Bento Grid Security Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Main Security Card - Enterprise Security */}
            <div className="col-span-12 lg:col-span-8 group">
              <div className="h-full min-h-[420px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 shadow-2xl relative card-premium">
                {/* Dynamic Security Waves */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="securityWave" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path d="M0,30 Q25,10 50,30 T100,30 L100,70 Q75,90 50,70 T0,70 Z" fill="url(#securityWave)" className="animate-float-premium" />
                  </svg>
                </div>
                
                <div className="relative h-full p-10 flex flex-col lg:flex-row items-center">
                  <div className="flex-1 mb-8 lg:mb-0">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-20 h-20 rounded-3xl glass-premium border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">
                          ENTERPRISE SECURITY
                        </div>
                        <h3 className="text-white text-3xl font-bold">
                          Advanced Protection Suite
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                      Bank-level security with comprehensive compliance features for enterprises and agencies managing sensitive client data across multiple social platforms.
                    </p>
                    
                    {/* Premium Security Features Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                      {[
                        { icon: Check, label: "SOC 2 Type II Compliance", detail: "Annual audits" },
                        { icon: Lock, label: "End-to-End Encryption", detail: "256-bit AES" },
                        { icon: Shield, label: "GDPR & CCPA Ready", detail: "Data protection" },
                        { icon: Eye, label: "Single Sign-On (SSO)", detail: "Enterprise identity" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 glass-premium rounded-xl p-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-sm">{feature.label}</div>
                            <div className="text-blue-200 text-xs">{feature.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="button-premium glass-premium border border-white/20 rounded-2xl px-8 py-4 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center space-x-3">
                        <span>Explore Security Features</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <div className="text-blue-200 text-sm">Trusted by Fortune 500</div>
                    </div>
                  </div>
                  
                  {/* Apple-style Security Visualization */}
                  <div className="flex-1 relative hidden lg:flex items-center justify-center">
                    <div className="relative">
                      {/* Central Security Hub */}
                      <div className="w-40 h-40 rounded-full glass-premium border-2 border-white/30 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center animate-float-premium">
                          <Lock className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      
                      {/* Orbiting Security Elements */}
                      {[
                        { icon: Shield, angle: 0, radius: 80, color: "from-blue-400 to-indigo-500" },
                        { icon: Check, angle: 72, radius: 80, color: "from-emerald-400 to-green-500" },
                        { icon: Eye, angle: 144, radius: 80, color: "from-purple-400 to-pink-500" },
                        { icon: Lock, angle: 216, radius: 80, color: "from-cyan-400 to-blue-500" },
                        { icon: Settings, angle: 288, radius: 80, color: "from-yellow-400 to-orange-500" }
                      ].map((element, idx) => (
                        <div
                          key={idx}
                          className="absolute w-16 h-16 rounded-2xl glass-premium border border-white/20 flex items-center justify-center animate-particles-float"
                          style={{
                            left: `calc(50% + ${Math.cos(element.angle * Math.PI / 180) * element.radius}px - 32px)`,
                            top: `calc(50% + ${Math.sin(element.angle * Math.PI / 180) * element.radius}px - 32px)`,
                            animationDelay: `${idx * 0.8}s`
                          }}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${element.color} flex items-center justify-center`}>
                            <element.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Integration Card */}
            <div className="col-span-12 lg:col-span-4 group">
              <div className="h-full min-h-[420px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 shadow-2xl relative card-premium">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 animate-gradient-shift" />
                
                <div className="relative h-full p-8 flex flex-col">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl glass-premium border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Network className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                        API ECOSYSTEM
                      </div>
                      <h3 className="text-white text-xl font-bold">
                        Integration Suite
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-emerald-100 mb-6 leading-relaxed">
                      Powerful APIs and extensive integration capabilities for custom workflows and enterprise system connectivity.
                    </p>
                    
                    {/* API Features */}
                    <div className="space-y-3 mb-6">
                      {[
                        "RESTful API with comprehensive documentation",
                        "Webhook support for real-time data synchronization", 
                        "Zapier integration with 3000+ popular business tools",
                        "Custom enterprise connectors available"
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-emerald-100 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* API Visualization */}
                    <div className="mb-6 relative">
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 animate-slow-pulse"
                            style={{
                              animationDelay: `${i * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full button-premium glass-premium border border-white/20 rounded-2xl py-4 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                    <span>View API Docs</span>
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row - Additional Enterprise Features */}
            <div className="col-span-12 lg:col-span-6 group">
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 shadow-2xl relative card-premium">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-shift" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl glass-premium border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-purple-200 text-xs font-bold uppercase tracking-wider">
                          TEAM MANAGEMENT
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          Advanced Collaboration
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-purple-100 mb-6 leading-relaxed">
                      Sophisticated team management with role-based permissions, workflow automation, and collaborative content creation tools.
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="button-premium glass-premium border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                        <span>Manage Teams</span>
                        <Users className="w-4 h-4" />
                      </button>
                      <div className="text-purple-200 text-sm">Multi-workspace support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 group">
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 shadow-2xl relative card-premium">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent animate-gradient-shift" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl glass-premium border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Crown className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-orange-200 text-xs font-bold uppercase tracking-wider">
                          WHITE-LABEL
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          Reseller Program
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-orange-100 mb-6 leading-relaxed">
                      Complete white-label solution with custom branding, dedicated infrastructure, and comprehensive reseller support programs.
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="button-premium glass-premium border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                        <span>Partner Program</span>
                        <Crown className="w-4 h-4" />
                      </button>
                      <div className="text-orange-200 text-sm">Custom branding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Industry Solutions - Apple-Inspired Premium Design */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-slate-50 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Industry Orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-5 animate-morph-premium-1" style={{
            background: 'radial-gradient(circle, #6366f1, #8b5cf6, #a855f7)',
            filter: 'blur(80px)',
          }} />
          <div className="absolute bottom-32 right-1/3 w-80 h-80 rounded-full opacity-8 animate-morph-premium-2" style={{
            background: 'radial-gradient(circle, #06b6d4, #0891b2, #0e7490)',
            filter: 'blur(60px)',
          }} />
          
          {/* Neural Network Grid */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="industry-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                  <circle cx="4" cy="4" r="0.8" fill="currentColor" opacity="0.4" className="animate-slow-pulse"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#industry-grid)" className="text-indigo-600" />
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-float-premium opacity-40" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-float-delayed-premium opacity-30" />
          <div className="absolute top-1/2 left-1/5 w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-particles-float opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Revolutionary Header with Apple-style Typography */}
          <div className="text-center mb-24">
            <div className="relative inline-flex items-center mb-8">
              <div className="glass-premium rounded-full px-8 py-4 backdrop-blur-xl border border-white/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center animate-float-premium">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold tracking-wide">Industry-Specific Solutions</span>
                </div>
              </div>
              
              {/* Floating Industry Icons */}
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-float-delayed-premium shadow-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-8 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-float-premium shadow-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Tailored for Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">
                Industry
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Specialized features and workflows designed for specific industries, ensuring compliance, 
              optimization, and best practices for your business sector.
            </p>
          </div>

          {/* Revolutionary Industry Cards - Apple Ecosystem Style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {revolutionaryIndustrySolutions.map((solution, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden industry-card-hover"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Optimized Card Container */}
                <div className={`relative bg-gradient-to-br ${solution.gradientFrom} ${solution.gradientTo} ${solution.hoverColor} backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.01] overflow-hidden`}>
                  
                  {/* Simple Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                  </div>

                  {/* Simplified Status Badges */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    {solution.liveDemo && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ● LIVE DEMO
                      </div>
                    )}
                    {solution.aiPowered && (
                      <div className="bg-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        AI-POWERED
                      </div>
                    )}
                    {solution.trending && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        TRENDING
                      </div>
                    )}
                    {solution.secure && (
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        SECURE
                      </div>
                    )}
                    {solution.premium && (
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </div>
                    )}
                  </div>

                  {/* Simplified Visual Elements */}
                  
                  <div className="relative p-10 text-white">
                    {/* Optimized Icon with Simple Effect */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl">
                          <div className="w-16 h-16 rounded-xl bg-white/90 flex items-center justify-center">
                            {React.cloneElement(solution.icon, { 
                              className: "text-gray-800"
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Real-Time Metrics Dashboard */}
                      <div className="flex flex-col gap-3">
                        {Object.entries(solution.metrics).map(([key, value]) => (
                          <div key={key} className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/40">
                            <div className="flex justify-between items-center">
                              <span className="text-white/90 text-sm font-medium capitalize">{key}</span>
                              <span className="text-white font-bold text-lg">{value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Revolutionary Content Header */}
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-4xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-500">
                          {solution.industry}
                        </h3>
                        <h4 className="text-xl font-semibold text-white/80 mb-4">
                          {solution.subtitle}
                        </h4>
                        <p className="text-white/90 leading-relaxed text-lg font-medium">{solution.description}</p>
                      </div>
                      
                      {/* Revolutionary AI-Powered Features Grid */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <Button
                            onClick={() => toggleSection(`industry-${index}`)}
                            variant="ghost"
                            className="flex items-center gap-3 text-white/80 hover:text-white p-0 group/btn bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
                              {expandedSections[`industry-${index}`] ? (
                                <ChevronUp className="w-4 h-4 text-white" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-semibold">
                              {expandedSections[`industry-${index}`] ? 'Hide Features' : 'Explore AI Features'}
                            </span>
                          </Button>
                          
                          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                            <span className="text-white font-bold text-sm">{solution.features.length} AI Tools</span>
                          </div>
                        </div>
                        
                        <div className={`grid grid-cols-1 gap-4 transition-all duration-700 overflow-hidden ${
                          expandedSections[`industry-${index}`] ? 'max-h-none opacity-100' : 'max-h-80 opacity-95'
                        }`}>
                          {solution.features.slice(0, expandedSections[`industry-${index}`] ? solution.features.length : 4).map((feature, idx) => (
                            <div 
                              key={idx} 
                              className="group/feature bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 cursor-pointer"
                              onMouseEnter={() => setSelectedFeature(index * 100 + idx)}
                              onMouseLeave={() => setSelectedFeature(null)}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-300 shadow-lg">
                                  <Zap className="w-5 h-5 text-gray-800" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-white font-medium leading-relaxed block">
                                    {feature}
                                  </span>
                                  {selectedFeature === index * 100 + idx && (
                                    <div className="mt-2 text-white/70 text-sm animate-fade-in">
                                      Advanced AI-powered automation with real-time optimization
                                    </div>
                                  )}
                                </div>
                                <div className="opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
                                  <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {!expandedSections[`industry-${index}`] && solution.features.length > 4 && (
                            <div className="text-center pt-2">
                              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer">
                                <span className="text-white font-medium">+{solution.features.length - 4} more AI tools</span>
                                <Sparkles className="w-4 h-4 ml-2 text-white animate-pulse" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Revolutionary Interactive CTA */}
                      <div className="pt-8 space-y-4">
                        <Button 
                          onClick={() => handleNavigation('veegpt')}
                          className="w-full bg-white/20 backdrop-blur-lg hover:bg-white/30 border border-white/40 hover:border-white/60 text-white font-bold py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 group/cta animate-button-premium-glow"
                        >
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center group-hover/cta:scale-110 transition-transform duration-300">
                              <PlayCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg">Experience {solution.industry} AI</span>
                            <div className="w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center group-hover/cta:translate-x-2 transition-transform duration-300">
                              <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </Button>
                        
                        {/* Live Demo Badge */}
                        <div className="flex items-center justify-center gap-2 text-white/80">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Live demo available • No signup required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA Section */}
          <div className="text-center mt-20">
            <div className="glass-premium rounded-3xl px-8 py-6 backdrop-blur-xl border border-white/30 inline-flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center animate-float-premium">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-gray-900">Don't see your industry?</h4>
                <p className="text-gray-600">Contact us for custom industry solutions</p>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Innovation Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-violet-900/50 to-blue-900/50 rounded-full px-6 py-3 mb-8 border border-violet-500/30">
              <Cpu className="w-5 h-5 text-violet-400 mr-2" />
              <span className="text-violet-300 font-semibold">Advanced Technology Stack</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Powered by Cutting-Edge AI
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Built on enterprise-grade infrastructure with the latest AI models, cloud computing, and security technologies to deliver unmatched performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced AI Models</h3>
              <p className="text-gray-400 mb-6">Multiple state-of-the-art AI models working in harmony to deliver exceptional results.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />GPT-4 Turbo for advanced reasoning</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Claude 3 for content analysis</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Custom fine-tuned models</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />DALL-E 3 for image generation</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Whisper for audio processing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cloud Infrastructure</h3>
              <p className="text-gray-400 mb-6">Enterprise-grade cloud infrastructure ensuring 99.9% uptime and global accessibility.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Multi-region deployment</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Auto-scaling architecture</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />CDN optimization</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Real-time monitoring</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Disaster recovery</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Security & Privacy</h3>
              <p className="text-gray-400 mb-6">Bank-level security with comprehensive privacy protection and regulatory compliance.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />End-to-end encryption</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />SOC 2 Type II certified</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />GDPR compliant</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Regular security audits</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-green-400 mr-3" />Zero-trust architecture</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-lg">Built with modern technologies: React, Node.js, MongoDB, Redis, Docker, Kubernetes, and more</p>
          </div>
        </div>
      </section>

      {/* Success Stories & Case Studies */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-8">
              <Award className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Success Stories</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Proven Results & Growth
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Real businesses achieving extraordinary results with VeeFore. From startups to Fortune 500 companies, see how our platform drives measurable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">500%</div>
                <div className="text-gray-600 font-semibold">Engagement Increase</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">E-commerce Fashion Brand</h3>
              <p className="text-gray-600 mb-6">A mid-size fashion retailer increased their social media engagement by 500% and sales by 200% within 6 months using VeeFore's AI content generation and automation features.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Followers Growth:</span><span className="font-semibold text-green-600">+250%</span></div>
                <div className="flex justify-between"><span>Content Efficiency:</span><span className="font-semibold text-green-600">+400%</span></div>
                <div className="flex justify-between"><span>Revenue Impact:</span><span className="font-semibold text-green-600">+200%</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
                <div className="text-gray-600 font-semibold">Time Saved</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Digital Marketing Agency</h3>
              <p className="text-gray-600 mb-6">A leading agency managing 100+ client accounts reduced content creation time by 90% while improving client satisfaction scores and expanding their service capacity.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Client Capacity:</span><span className="font-semibold text-green-600">+300%</span></div>
                <div className="flex justify-between"><span>Response Time:</span><span className="font-semibold text-green-600">-85%</span></div>
                <div className="flex justify-between"><span>Client Retention:</span><span className="font-semibold text-green-600">+95%</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-green-600 mb-2">$2M</div>
                <div className="text-gray-600 font-semibold">Revenue Generated</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">SaaS Startup</h3>
              <p className="text-gray-600 mb-6">A B2B SaaS startup generated $2M in additional revenue through VeeFore's lead generation automation and strategic content planning over 12 months.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between"><span>Lead Quality:</span><span className="font-semibold text-green-600">+180%</span></div>
                <div className="flex justify-between"><span>Conversion Rate:</span><span className="font-semibold text-green-600">+120%</span></div>
                <div className="flex justify-between"><span>Customer LTV:</span><span className="font-semibold text-green-600">+150%</span></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Read Complete Case Studies
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-slate-100 rounded-full px-6 py-3 mb-8">
              <Network className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-800 font-semibold">Platform Integrations</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Connect Everything
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Seamless integration with all major social media platforms, business tools, and third-party services to create a unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            {[
              { name: "Instagram", users: "2B+" },
              { name: "Facebook", users: "3B+" },
              { name: "Twitter/X", users: "500M+" },
              { name: "LinkedIn", users: "900M+" },
              { name: "TikTok", users: "1B+" },
              { name: "YouTube", users: "2.7B+" },
              { name: "Pinterest", users: "450M+" },
              { name: "Snapchat", users: "375M+" },
              { name: "Reddit", users: "430M+" },
              { name: "Discord", users: "150M+" },
              { name: "Telegram", users: "700M+" },
              { name: "WhatsApp", users: "2.8B+" }
            ].map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{platform.name}</h3>
                <p className="text-sm text-gray-600">{platform.users} users</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Tools Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">CRM Systems</h4>
                <p className="text-gray-600 text-sm">Salesforce, HubSpot, Pipedrive, Zoho</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Analytics</h4>
                <p className="text-gray-600 text-sm">Google Analytics, Adobe Analytics, Mixpanel</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Automation</h4>
                <p className="text-gray-600 text-sm">Zapier, Make, Microsoft Power Automate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">E-commerce</h4>
                <p className="text-gray-600 text-sm">Shopify, WooCommerce, Magento, BigCommerce</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-8">
              <CreditCard className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold">Transparent Pricing</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your business. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border transition-all duration-500 overflow-hidden ${
                  tier.popular 
                    ? 'border-violet-200 ring-4 ring-violet-100 transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                      <span className="text-gray-600">{tier.period}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{tier.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {tier.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required • Cancel anytime</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2" />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 mb-8">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-semibold">Customer Success</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Loved by Thousands
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their social media presence with VeeFore.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-violet-600 font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-blue-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Social Media?
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join the future of social media management. Start with VeeGPT and explore our complete AI platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => handleNavigation('veegpt')}
              className="bg-white text-violet-600 hover:bg-gray-50 px-12 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-white"
            >
              <Bot className="w-6 h-6 mr-3" />
              Start with VeeGPT Free
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-lg font-bold rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <Video className="w-6 h-6 mr-3" />
              Explore Video Studio
            </Button>
          </div>

          <div className="mt-12 text-blue-100">
            <p className="text-lg">🚀 Join thousands of creators already transforming their social media with VeeFore</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">VeeFore</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                The future of social media management. AI-powered platform for creators, businesses, and agencies who want to dominate social media.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">VeeGPT AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Studio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics Pro</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Content Studio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Automation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unified Inbox</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Affiliate Program</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-6">Support & Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 VeeFore. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span>SOC 2 Compliant</span>
              <span>GDPR Ready</span>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing