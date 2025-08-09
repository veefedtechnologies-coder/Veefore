import { useState, useEffect } from 'react'
import { 
  ChevronDown, Play, Star, TrendingUp, Users, Zap, Shield, Target, Globe, ArrowRight, Check, 
  Building2, BarChart3, Calendar, MessageSquare, Bot, Award, Clock, Eye, Heart, Share2, 
  DollarSign, Lightbulb, Rocket, Filter, Search, Bell, Settings, Upload, Download, Lock, 
  Smartphone, Laptop, Monitor, Sparkles, Crown, Diamond, Layers, Infinity, Cpu, Brain, 
  Network, Wand2, Palette, Music, Video, Image, FileText, Mic, Camera, Megaphone, Compass, 
  Map, Database, Code, Server, Cloud, Gauge, LineChart, PieChart, Activity, Headphones, 
  ShoppingCart, CreditCard, Wallet, ChevronRight, ExternalLink, Github, Twitter
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingProps {
  onNavigate: (view: string) => void
}

const Landing = ({ onNavigate }: LandingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 8)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const handleNavigation = (page: string) => {
    onNavigate(page)
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

  // Detailed feature sections with comprehensive information
  const detailedFeatures = [
    {
      title: "AI-Powered Content Creation & Video Generation",
      description: "Transform your content strategy with our revolutionary AI content creation suite. Generate high-quality posts, captions, scripts, and professional videos using advanced AI models. Our Cosmos Video Generator creates stunning visual content with automated scene selection, voiceover generation, and smart editing capabilities.",
      icon: <Wand2 className="w-16 h-16 text-blue-500" />,
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      image: "/api/placeholder/600/400",
      details: [
        "Advanced AI content generation using GPT-4 and custom models",
        "Professional video creation with automated script writing and scene generation",
        "Multi-format content optimization for different social platforms",
        "Brand voice consistency across all generated content",
        "Trending topic integration and viral content prediction",
        "Custom template library with industry-specific content frameworks",
        "Real-time content performance prediction and optimization suggestions",
        "Automated hashtag research and audience targeting recommendations"
      ]
    },
    {
      title: "Advanced Analytics & Performance Insights",
      description: "Make data-driven decisions with our comprehensive analytics platform. Track performance across all social media channels, analyze competitor strategies, monitor engagement patterns, and get actionable insights to optimize your social media ROI and growth trajectory.",
      icon: <BarChart3 className="w-16 h-16 text-purple-500" />,
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      image: "/api/placeholder/600/400",
      details: [
        "Real-time performance tracking across all major social platforms",
        "Advanced engagement analytics with demographic breakdowns",
        "Competitor benchmarking and gap analysis tools",
        "Custom report building with white-label options",
        "Automated performance alerts and optimization recommendations",
        "Cross-platform analytics consolidation and unified reporting",
        "ROI tracking and campaign attribution analysis",
        "Predictive analytics for content performance and audience growth"
      ]
    },
    {
      title: "Smart Scheduling & Intelligent Calendar Management",
      description: "Schedule content at optimal times with AI-powered timing recommendations. Our intelligent calendar learns your audience behavior, suggests trending dates, and automates content distribution across all platforms for maximum reach and engagement.",
      icon: <Calendar className="w-16 h-16 text-green-500" />,
      gradient: "from-green-500 via-teal-500 to-blue-500",
      image: "/api/placeholder/600/400",
      details: [
        "AI-optimized posting time recommendations based on audience activity",
        "Bulk scheduling with advanced drag-and-drop calendar interface",
        "Content queue management with automatic conflict resolution",
        "Trending events and holiday calendar integration",
        "Time zone optimization for global audience targeting",
        "Content recycling and evergreen post automation",
        "Team collaboration with approval workflows and content assignments",
        "Emergency posting and crisis management tools"
      ]
    },
    {
      title: "Unified Inbox & Customer Engagement Hub",
      description: "Manage all your social conversations from one powerful inbox. Automate responses, prioritize messages, and maintain consistent customer service across all platforms with AI-powered message categorization and suggested replies.",
      icon: <MessageSquare className="w-16 h-16 text-orange-500" />,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      image: "/api/placeholder/600/400",
      details: [
        "Unified inbox for all social media messages and comments",
        "AI-powered message categorization and priority scoring",
        "Automated response suggestions with brand voice consistency",
        "Customer service ticket integration and escalation workflows",
        "Sentiment analysis and crisis detection for immediate alerts",
        "Team collaboration with message assignment and tracking",
        "Response templates and canned message libraries",
        "Performance tracking for response times and customer satisfaction"
      ]
    },
    {
      title: "Multi-Platform Publishing & Social Media Management",
      description: "Manage Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok, Pinterest, and more from one unified dashboard. Cross-post content, maintain brand consistency, and adapt formats automatically for each platform's unique requirements.",
      icon: <Globe className="w-16 h-16 text-indigo-500" />,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      image: "/api/placeholder/600/400",
      details: [
        "Support for 20+ major social media platforms and emerging networks",
        "Intelligent content adaptation for platform-specific formats and requirements",
        "Cross-platform publishing with single-click distribution",
        "Platform-specific optimization for maximum reach and engagement",
        "Account health monitoring and compliance checking",
        "Centralized asset library with advanced search and tagging",
        "Brand guidelines enforcement across all platforms",
        "Automated content versioning for different platform specifications"
      ]
    },
    {
      title: "Advanced Automation & Workflow Intelligence",
      description: "Automate repetitive tasks and create intelligent workflows that respond to audience behavior, engage with followers, manage comments, and grow your social presence 24/7 while maintaining authentic brand interactions.",
      icon: <Zap className="w-16 h-16 text-yellow-500" />,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      image: "/api/placeholder/600/400",
      details: [
        "Smart automation rules with conditional logic and triggers",
        "Automated comment management and response generation",
        "Follower engagement automation with authentic interaction patterns",
        "Lead generation workflows with CRM integration",
        "Crisis management automation with escalation protocols",
        "Growth hacking automation for follower acquisition",
        "Content curation automation with quality filtering",
        "Performance-based automation adjustments and optimization"
      ]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                VeeFore
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#platform" className="text-gray-600 hover:text-gray-900 transition-colors">Platform</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Button 
                onClick={() => handleNavigation('veegpt')}
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try VeeGPT Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-blue-100 rounded-full px-6 py-3 mb-8 border border-violet-200/50">
              <Rocket className="w-5 h-5 text-violet-600 mr-2" />
              <span className="text-violet-800 font-semibold">Launching Soon • Complete AI-Powered Social Media Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-blue-800 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Social Media Management
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI platform that combines chat assistance, video generation, analytics, automation, and content creation. 
              Built for creators, businesses, and agencies who want to dominate social media with intelligent automation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => handleNavigation('veegpt')}
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Bot className="w-6 h-6 mr-3" />
                Try VeeGPT Now - Free
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-gray-300 hover:border-violet-300 text-gray-700 hover:text-violet-700 px-10 py-4 text-lg font-semibold rounded-xl hover:bg-violet-50 transition-all duration-300"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo Video
              </Button>
            </div>

            {/* Platform Preview */}
            <div className="relative max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white font-semibold">VeeFore AI Platform - All Features</span>
                </div>
                <div className="p-2">
                  <img 
                    src={platformFeatures[activeFeature].image} 
                    alt={platformFeatures[activeFeature].title}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Feature indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platformFeatures[activeFeature].color} flex items-center justify-center text-white`}>
                    {platformFeatures[activeFeature].icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{platformFeatures[activeFeature].title}</div>
                    <div className="text-sm text-gray-600">{platformFeatures[activeFeature].subtitle}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Overview */}
      <section id="platform" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <Layers className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold">Complete Platform</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All-in-One Solution
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for social media success in one powerful platform. From AI chat to video generation, analytics to automation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 ${
                  hoveredFeature === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => handleNavigation(feature.link.substring(1))}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-violet-600 group-hover:to-blue-600 transition-all duration-500">
                    {feature.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    {feature.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {feature.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feat}</span>
                      </div>
                    ))}
                    {feature.features.length > 3 && (
                      <div className="text-sm text-gray-500">+{feature.features.length - 3} more features</div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-violet-600 font-semibold group-hover:text-violet-700 transition-colors">
                    <span>Explore {feature.title.split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover Preview */}
                <div className="absolute inset-x-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-8">
              <Wand2 className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-800 font-semibold">Advanced Features</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Comprehensive Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed breakdown of every feature and capability that makes VeeFore the most advanced social media management platform available.
            </p>
          </div>

          <div className="space-y-24">
            {detailedFeatures.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                {/* Image/Visual */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-20 blur-3xl scale-105`}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                      <div className="p-8 text-center">
                        <div className="mb-6">
                          {feature.icon}
                        </div>
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-64 object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2">
                  <h3 className="text-4xl font-bold text-gray-900 mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="ml-4 text-gray-700 leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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