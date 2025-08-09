import { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown, ChevronUp, Play, Star, TrendingUp, Users, Zap, Shield, Target, Globe, ArrowRight, Check, 
  Building2, BarChart3, Calendar, MessageSquare, Bot, Award, Clock, Eye, Heart, Share2, 
  DollarSign, Lightbulb, Rocket, Filter, Search, Bell, Settings, Upload, Download, Lock, 
  Smartphone, Laptop, Monitor, Sparkles, Crown, Diamond, Layers, Infinity, Cpu, Brain, 
  Network, Wand2, Palette, Music, Video, Image, FileText, Mic, Camera, Megaphone, Compass, 
  Map, Database, Code, Server, Cloud, Gauge, LineChart, PieChart, Activity, Headphones, 
  ShoppingCart, CreditCard, Wallet, ChevronRight, ExternalLink, Github, Twitter, MousePointer2,
  Maximize2, Move3D, Sparkle, Waves, Orbit, Hexagon, Triangle, Circle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingProps {
  onNavigate: (view: string) => void
}

const Landing = ({ onNavigate }: LandingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
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
    setIsVisible(true)
    
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
      image: "/api/placeholder/600/400",
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
      image: "/api/placeholder/600/400",
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
      image: "/api/placeholder/600/400",
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
      image: "/api/placeholder/600/400",
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
      title: "Smart Automation Engine - Advanced Workflow Intelligence",
      description: "Transform your social media management with our sophisticated automation platform that goes beyond simple scheduling. Create intelligent workflows that respond to audience behavior, market conditions, and performance metrics in real-time.",
      icon: <Zap className="w-16 h-16 text-yellow-500" />,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      image: "/api/placeholder/600/400",
      details: [
        "Advanced rule-based automation with conditional logic, triggers, and complex workflow chains",
        "AI-powered comment management with context-aware responses and sentiment analysis",
        "Intelligent follower engagement with authentic interaction patterns and relationship building",
        "Lead generation automation with CRM integration and qualification scoring",
        "Crisis management protocols with automated escalation and reputation protection",
        "Growth hacking automation using proven strategies for organic follower acquisition",
        "Content curation workflows with quality filtering and brand alignment checking",
        "Performance-based optimization that automatically adjusts strategies based on results",
        "Cross-platform synchronization ensuring consistent messaging and timing across all networks",
        "Audience segmentation automation with behavioral targeting and personalized messaging",
        "Competitor monitoring with automated alerts for mentions, campaigns, and strategy changes",
        "Influencer outreach automation with personalized messaging and relationship management",
        "Event-triggered campaigns that respond to real-world events, trends, and opportunities",
        "Advanced scheduling with dynamic timing optimization based on audience activity patterns",
        "Workflow analytics with performance tracking and continuous improvement suggestions"
      ]
    },
    {
      title: "Unified Social Inbox - Enterprise Communication Hub",
      description: "Centralize all your social media communications in one powerful inbox designed for teams and enterprises. Manage conversations, customer service, and community engagement with AI-powered efficiency and human-level quality.",
      icon: <MessageSquare className="w-16 h-16 text-indigo-500" />,
      gradient: "from-indigo-500 via-blue-500 to-purple-500",
      image: "/api/placeholder/600/400",
      details: [
        "Unified inbox aggregating messages from 20+ social platforms and communication channels",
        "AI-powered message categorization with priority scoring and urgency detection",
        "Automated response suggestions maintaining brand voice consistency and context awareness",
        "Advanced customer service features with ticket creation and escalation workflows",
        "Real-time sentiment analysis with mood tracking and customer satisfaction scoring",
        "Team collaboration tools with message assignment, internal notes, and workload distribution",
        "Response template library with dynamic personalization and smart suggestions",
        "Performance analytics tracking response times, resolution rates, and customer satisfaction",
        "Multi-language support with automatic translation and culturally appropriate responses",
        "CRM integration with customer history, purchase data, and interaction tracking",
        "Automated follow-up sequences for lead nurturing and customer retention",
        "Crisis detection and management with escalation protocols and executive notifications",
        "Knowledge base integration for consistent information sharing and FAQ automation",
        "Advanced filtering and search capabilities with tag-based organization and custom views",
        "Quality assurance tools with response monitoring and team performance evaluation"
      ]
    },
    {
      title: "Smart Calendar & Strategic Planning Platform",
      description: "Master your content strategy with our intelligent calendar system that combines AI-powered optimization with comprehensive planning tools. Plan, schedule, and optimize your content for maximum impact across all platforms.",
      icon: <Calendar className="w-16 h-16 text-green-500" />,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      image: "/api/placeholder/600/400",
      details: [
        "AI-optimized posting schedules based on audience behavior, platform algorithms, and engagement patterns",
        "Advanced drag-and-drop calendar interface with bulk editing and multi-platform coordination",
        "Content queue management with automatic conflict resolution and optimal distribution",
        "Trending events and holiday integration with timely content suggestions and campaign ideas",
        "Global time zone optimization for international audiences and market-specific timing",
        "Content recycling engine for evergreen posts with performance-based resharing",
        "Team collaboration features with approval workflows, content assignments, and deadline tracking",
        "Emergency publishing capabilities for crisis management and real-time response",
        "Campaign planning tools with milestone tracking and performance goal setting",
        "Content gap analysis identifying opportunities for improved posting frequency and timing",
        "Seasonal trend prediction with historical data analysis and future planning recommendations",
        "Resource allocation planning for content creation and marketing budget optimization",
        "Integration with content creation tools for seamless workflow from ideation to publication",
        "Performance forecasting using historical data and market trends to predict campaign success",
        "Advanced analytics showing optimal posting patterns and audience engagement windows"
      ]
    },
    {
      title: "Growth Engine - Advanced Audience Development Platform",
      description: "Accelerate your audience growth with our comprehensive platform that combines AI-driven strategies, competitive intelligence, and proven growth tactics to build engaged, high-value communities around your brand.",
      icon: <TrendingUp className="w-16 h-16 text-purple-500" />,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      image: "/api/placeholder/600/400",
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

  // Additional comprehensive platform capabilities
  const enterpriseFeatures = [
    {
      title: "Enterprise Security & Compliance",
      description: "Bank-level security with comprehensive compliance features for enterprises and agencies managing sensitive client data.",
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      features: [
        "SOC 2 Type II compliance with annual audits",
        "GDPR and CCPA compliance with data protection controls",
        "Single Sign-On (SSO) integration with enterprise identity providers",
        "Role-based access control with granular permissions",
        "Data encryption at rest and in transit using AES-256",
        "Audit logging with comprehensive activity tracking",
        "IP whitelisting and VPN integration",
        "Regular security assessments and penetration testing"
      ]
    },
    {
      title: "API & Integration Ecosystem",
      description: "Powerful APIs and extensive integration capabilities for custom workflows and enterprise system connectivity.",
      icon: <Code className="w-12 h-12 text-green-600" />,
      features: [
        "RESTful API with comprehensive documentation",
        "Webhook support for real-time data synchronization",
        "Zapier integration with 3000+ popular business tools",
        "Custom integration development support",
        "CRM integrations (Salesforce, HubSpot, Pipedrive)",
        "Marketing automation platform connectivity",
        "Analytics platform data export capabilities",
        "Developer sandbox environment for testing"
      ]
    },
    {
      title: "Advanced Team Management",
      description: "Sophisticated team collaboration and management features designed for agencies and large organizations.",
      icon: <Users className="w-12 h-12 text-purple-600" />,
      features: [
        "Unlimited team members with role-based permissions",
        "Client workspace separation with branded environments",
        "Advanced approval workflows with custom review processes",
        "Team performance analytics and productivity insights",
        "Resource allocation and capacity planning tools",
        "Time tracking and billing integration capabilities",
        "Custom notification systems and communication channels",
        "Training resources and onboarding automation"
      ]
    },
    {
      title: "White-Label & Reseller Program",
      description: "Complete white-label solutions for agencies and resellers to offer VeeFore under their own brand.",
      icon: <Award className="w-12 h-12 text-orange-600" />,
      features: [
        "Fully customizable branding with your logo and colors",
        "Custom domain hosting with SSL certificates",
        "Reseller pricing tiers with volume discounts",
        "Marketing materials and sales support",
        "Technical support for your clients",
        "Revenue sharing opportunities",
        "Co-marketing program participation",
        "Priority feature development consideration"
      ]
    }
  ]

  // Industry-specific solutions
  const industrySolutions = [
    {
      industry: "E-commerce & Retail",
      description: "Specialized tools for product promotion, sales conversion, and customer retention in the retail sector.",
      icon: <ShoppingCart className="w-12 h-12 text-blue-500" />,
      features: [
        "Product catalog integration with automated posting",
        "Shopping tag automation for Instagram and Facebook",
        "Inventory-based content scheduling",
        "Customer review management and showcase",
        "Seasonal campaign automation",
        "Abandoned cart recovery campaigns",
        "Influencer partnership management",
        "Sales attribution and ROI tracking"
      ]
    },
    {
      industry: "Healthcare & Wellness",
      description: "Compliant social media management with specialized features for healthcare professionals and wellness brands.",
      icon: <Heart className="w-12 h-12 text-red-500" />,
      features: [
        "HIPAA-compliant content management",
        "Medical content review workflows",
        "Patient education content library",
        "Appointment booking integration",
        "Health awareness campaign automation",
        "Professional credibility building tools",
        "Community health engagement features",
        "Regulatory compliance monitoring"
      ]
    },
    {
      industry: "Professional Services",
      description: "Build authority and generate leads for consulting, legal, financial, and other professional service firms.",
      icon: <Building2 className="w-12 h-12 text-gray-600" />,
      features: [
        "Thought leadership content automation",
        "Client testimonial showcase tools",
        "Industry expertise demonstration",
        "Lead qualification and nurturing",
        "Professional network building",
        "Speaking engagement promotion",
        "Case study content creation",
        "Industry trend commentary automation"
      ]
    },
    {
      industry: "Technology & SaaS",
      description: "Growth-focused features for technology companies, startups, and SaaS businesses looking to scale.",
      icon: <Cpu className="w-12 h-12 text-purple-500" />,
      features: [
        "Product update announcement automation",
        "Developer community engagement",
        "Technical content optimization",
        "User onboarding content sequences",
        "Feature adoption tracking and promotion",
        "Beta testing community management",
        "Integration partner showcasing",
        "Technical documentation promotion"
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
              {['Features', 'Platform', 'Pricing', 'Solutions'].map((item, index) => (
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
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-b-[2.5rem] min-h-[350px]">
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
                  <div className="mt-12 space-y-6">
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
                                <div className={`absolute top-0 z-50 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-xl w-72 ${
                                  index % 4 >= 2 ? 'right-full mr-2' : 'left-full ml-2'
                                }`}>
                                  <div className="text-left">
                                    <h5 className="text-gray-900 font-semibold text-sm mb-2">{feature.title}</h5>
                                    <p className="text-gray-600 text-xs mb-3">{feature.description}</p>
                                    <div className="space-y-1">
                                      {feature.features.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-center space-x-2 text-xs text-gray-700">
                                          <div className="w-1 h-1 bg-violet-500 rounded-full" />
                                          <span>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <button className={`mt-3 px-4 py-2 rounded-lg bg-gradient-to-r ${feature.color} text-white text-xs font-medium hover:shadow-lg transition-all`}>
                                      Try {feature.title.split(' ')[0]}
                                    </button>
                                  </div>
                                  {/* Arrow pointing to card */}
                                  <div className={`absolute top-4 ${
                                    index % 4 >= 2 
                                      ? 'left-full w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white/95'
                                      : 'right-full w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white/95'
                                  }`}></div>
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
          
          {/* Dynamic Gradient Orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 animate-morph-1" style={{
              background: 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)',
              filter: 'blur(60px)',
            }} />
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-15 animate-morph-2" style={{
              background: 'conic-gradient(from 90deg, #f59e0b, #ef4444, #8b5cf6, #f59e0b)',
              filter: 'blur(50px)',
            }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 animate-morph-3" style={{
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
                        {platformFeatures[0].title.split(' - ')[0]}
                      </h3>
                      
                      <p className="text-white/80 text-lg lg:text-xl mb-8 leading-relaxed">
                        {platformFeatures[0].description}
                      </p>
                      
                      {/* Advanced Feature Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {platformFeatures[0].features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white/90 text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleNavigation('veegpt')}
                          className="bg-white text-gray-900 rounded-2xl px-8 py-4 font-bold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                        >
                          <span>Experience VeeGPT</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2 text-white/60 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span>Live & Interactive</span>
                        </div>
                      </div>
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
                      
                      {/* Floating Action Cards */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-float shadow-xl">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-float-delayed shadow-xl">
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
                        {platformFeatures[1].icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                        {platformFeatures[1].subtitle}
                      </div>
                      <div className="text-white text-lg font-bold">
                        {platformFeatures[1].title.split(' - ')[0]}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      {platformFeatures[1].description.substring(0, 200)}...
                    </p>
                    
                    {/* Feature Metrics */}
                    <div className="space-y-4 mb-8">
                      {platformFeatures[1].features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-white/80 text-sm">{feature.substring(0, 20)}...</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-white to-cyan-200 rounded-full animate-pulse"
                                style={{ width: `${70 + idx * 15}%` }}
                              />
                            </div>
                            <span className="text-white/60 text-xs">{70 + idx * 15}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2">
                    <span>Explore Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Ambient Graphics */}
                <div className="absolute top-8 right-8 opacity-20">
                  <div className="w-32 h-32 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </div>
            </div>

            {/* Tertiary Features - Wide Cards */}
            <div className="col-span-12 lg:col-span-6 group">
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                        <div className="text-white text-xl">
                          {platformFeatures[2].icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                          {platformFeatures[2].subtitle}
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          {platformFeatures[2].title.split(' - ')[0]}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {platformFeatures[2].description.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300">
                        View Analytics
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
              <div className="h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent" />
                
                <div className="relative h-full p-8 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                        <div className="text-white text-xl">
                          {platformFeatures[3].icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs font-bold uppercase tracking-wider">
                          {platformFeatures[3].subtitle}
                        </div>
                        <h3 className="text-white text-2xl font-bold">
                          {platformFeatures[3].title.split(' - ')[0]}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {platformFeatures[3].description.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300">
                        Create Content
                      </button>
                      <div className="text-white/60 text-sm">AI-powered</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative hidden lg:flex items-center justify-center">
                    {/* Creative Elements */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-white/30 flex items-center justify-center animate-bounce">
                        <Sparkles className="w-4 h-4 text-white" />
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

      {/* Enterprise Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-8">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold">Enterprise Solutions</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Built for Scale & Security
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Advanced enterprise features designed for large organizations, agencies, and businesses requiring maximum security, compliance, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200">
                <div className="p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{feature.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        onClick={() => toggleSection(`enterprise-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0"
                      >
                        {expandedSections[`enterprise-${index}`] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less Features
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show All Features
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`space-y-4 transition-all duration-500 overflow-hidden ${
                      expandedSections[`enterprise-${index}`] ? 'max-h-none' : 'max-h-40'
                    }`}>
                      {feature.features.slice(0, expandedSections[`enterprise-${index}`] ? feature.features.length : 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="ml-4 text-gray-700 leading-relaxed">{feat}</span>
                        </div>
                      ))}
                      {!expandedSections[`enterprise-${index}`] && feature.features.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            +{feature.features.length - 3} more features
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <Target className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-indigo-800 font-semibold">Industry-Specific Solutions</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tailored for Your Industry
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Specialized features and workflows designed for specific industries, ensuring compliance, optimization, and best practices for your business sector.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industrySolutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 group">
                <div className="p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{solution.industry}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{solution.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        onClick={() => toggleSection(`industry-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0"
                      >
                        {expandedSections[`industry-${index}`] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            View All Features
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`space-y-4 transition-all duration-500 overflow-hidden ${
                      expandedSections[`industry-${index}`] ? 'max-h-none' : 'max-h-40'
                    }`}>
                      {solution.features.slice(0, expandedSections[`industry-${index}`] ? solution.features.length : 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="ml-4 text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      {!expandedSections[`industry-${index}`] && solution.features.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            +{solution.features.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      variant="outline"
                      className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Learn More About {solution.industry}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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