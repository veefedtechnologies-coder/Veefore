import { useState, useEffect } from 'react'
import { ChevronDown, Play, Star, TrendingUp, Users, Zap, Shield, Target, Globe, ArrowRight, Check, Building2, BarChart3, Calendar, MessageSquare, Bot, Award, Clock, Eye, Heart, Share2, Trending, DollarSign, Lightbulb, Rocket, Filter, Search, Bell, Settings, Upload, Download, Lock, Smartphone, Laptop, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LandingProps {
  onNavigate: (view: string) => void
}

const Landing = ({ onNavigate }: LandingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6)
    }, 5000)

    // Auto-cycle through testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 4)
    }, 4000)
    
    return () => {
      clearInterval(interval)
      clearInterval(testimonialInterval)
    }
  }, [])

  const handleNavigation = (page: string) => {
    onNavigate(page)
  }

  const stats = [
    { value: "2.5M+", label: "Active Users Worldwide", sublabel: "Growing by 50K monthly" },
    { value: "150+", label: "Countries & Territories", sublabel: "Global reach expanding" },
    { value: "99.9%", label: "Uptime Guarantee", sublabel: "Enterprise-grade reliability" },
    { value: "500M+", label: "Posts Scheduled", sublabel: "Content automation at scale" },
    { value: "85%", label: "Average Engagement Boost", sublabel: "AI-optimized content performance" },
    { value: "24/7", label: "Customer Support", sublabel: "Expert assistance always available" }
  ]

  const features = [
    {
      title: "VeeGPT: Revolutionary AI Assistant",
      description: "Our flagship AI trained on real-time social trends creates content that resonates. Generate viral posts, engaging captions, trending hashtags, and complete campaign strategies with AI that understands your brand voice and audience preferences.",
      icon: <Bot className="w-16 h-16 text-purple-500" />,
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      image: "/api/placeholder/600/400",
      details: [
        "Advanced natural language processing for brand voice consistency",
        "Real-time trend analysis and viral content prediction",
        "Multi-format content generation (posts, stories, reels, videos, carousels)",
        "Smart hashtag research and optimization strategies",
        "Competitor content analysis and performance benchmarking",
        "Automated A/B testing for content variations",
        "Cross-platform content adaptation and formatting",
        "Sentiment analysis and audience emotion targeting"
      ]
    },
    {
      title: "Advanced Analytics & Performance Intelligence",
      description: "Get deep insights into your social media performance with AI-driven analytics, predictive forecasting, and comprehensive reporting. Track ROI, measure engagement quality, and discover optimization opportunities with enterprise-grade analytics.",
      icon: <BarChart3 className="w-16 h-16 text-blue-500" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      image: "/api/placeholder/600/400",
      details: [
        "Real-time performance dashboards with customizable KPI tracking",
        "Advanced attribution modeling for campaign ROI measurement",
        "Predictive analytics for content performance forecasting",
        "Audience segmentation and behavioral pattern analysis",
        "Comprehensive competitor benchmarking and gap analysis",
        "Custom report building with white-label options",
        "Automated performance alerts and optimization recommendations",
        "Cross-platform analytics consolidation and unified reporting"
      ]
    },
    {
      title: "Smart Calendar & Intelligent Scheduling",
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
        "Team collaboration with approval workflows",
        "Emergency posting and crisis management tools"
      ]
    },
    {
      title: "Unified Inbox & Customer Engagement",
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
      title: "Multi-Platform Publishing & Management",
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
        "API integrations with custom platforms and enterprise tools"
      ]
    },
    {
      title: "Advanced Automation & Workflow Intelligence",
      description: "Set up sophisticated automation workflows that respond to audience behavior, trigger based on performance metrics, and maintain engagement 24/7. Create complex rules that adapt your strategy automatically based on real-time data.",
      icon: <Zap className="w-16 h-16 text-yellow-500" />,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      image: "/api/placeholder/600/400",
      details: [
        "Complex workflow automation with conditional logic and triggers",
        "Behavioral targeting and audience interaction automation",
        "Performance-based content optimization and republishing",
        "Lead generation and nurturing automation sequences",
        "Crisis management and reputation monitoring automation",
        "Influencer outreach and relationship management automation",
        "E-commerce integration with automated product promotions",
        "Custom webhook integrations and API automation capabilities"
      ]
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Social Media Director",
      company: "TechFlow Innovations",
      image: "/api/placeholder/80/80",
      quote: "VeeFore transformed our social media strategy completely. Our engagement increased by 340% in just 3 months, and the AI content generation saves our team 15 hours per week. The ROI has been incredible.",
      metrics: { engagement: "+340%", time_saved: "15h/week", roi: "450%" }
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Manager",
      company: "Global Retail Co.",
      image: "/api/placeholder/80/80",
      quote: "The analytics insights from VeeFore helped us identify our best-performing content types and optimal posting times. We've doubled our follower growth rate and tripled our conversion rate from social media.",
      metrics: { followers: "+200%", conversions: "+300%", reach: "+180%" }
    },
    {
      name: "Emily Watson",
      role: "Brand Manager",
      company: "Creative Studio Plus",
      image: "/api/placeholder/80/80",
      quote: "VeeGPT creates content that perfectly matches our brand voice. Our clients are amazed by the consistency and quality. The multi-platform management feature is a game-changer for our agency.",
      metrics: { clients: "+80%", efficiency: "+250%", satisfaction: "98%" }
    },
    {
      name: "David Kim",
      role: "CMO",
      company: "E-commerce Giant",
      image: "/api/placeholder/80/80",
      quote: "The automation features have revolutionized how we handle customer service on social media. Response times improved by 85%, and customer satisfaction scores are at an all-time high.",
      metrics: { response_time: "-85%", satisfaction: "+95%", volume: "+400%" }
    }
  ]

  const useCases = [
    {
      category: "Startups & Small Business",
      title: "Accelerate Growth with AI-Powered Social Media",
      description: "Perfect for growing businesses that need professional social media presence without a large team.",
      features: ["AI content generation", "Automated scheduling", "Basic analytics", "Multi-platform posting"],
      icon: <Rocket className="w-12 h-12 text-blue-500" />,
      color: "blue"
    },
    {
      category: "Growing Companies",
      title: "Scale Your Social Media Operations",
      description: "Ideal for mid-size companies looking to scale their social media efforts and improve team efficiency.",
      features: ["Advanced analytics", "Team collaboration", "Workflow automation", "Customer support"],
      icon: <TrendingUp className="w-12 h-12 text-green-500" />,
      color: "green"
    },
    {
      category: "Enterprise Organizations",
      title: "Enterprise-Grade Social Media Management",
      description: "Comprehensive solution for large organizations with complex social media requirements and compliance needs.",
      features: ["Custom integrations", "Advanced security", "Dedicated support", "White-label options"],
      icon: <Building2 className="w-12 h-12 text-purple-500" />,
      color: "purple"
    }
  ]

  const industries = [
    {
      name: "E-commerce & Retail",
      description: "Drive sales with product-focused content, automated customer service, and shopping integrations.",
      features: ["Product catalog integration", "Shopping tag automation", "Customer review management", "Sales tracking"],
      icon: <DollarSign className="w-10 h-10 text-green-500" />,
      use_cases: [
        "Automated product showcases and promotions",
        "Customer service automation for order inquiries",
        "User-generated content campaigns and contests",
        "Seasonal marketing automation and trend capitalization"
      ]
    },
    {
      name: "Healthcare & Wellness",
      description: "Maintain compliance while engaging patients with educational content and community building.",
      features: ["HIPAA compliance tools", "Educational content templates", "Community management", "Crisis communication"],
      icon: <Heart className="w-10 h-10 text-red-500" />,
      use_cases: [
        "Patient education and wellness tip automation",
        "Appointment reminder and follow-up sequences",
        "Healthcare provider reputation management",
        "Medical event and awareness campaign coordination"
      ]
    },
    {
      name: "Technology & SaaS",
      description: "Showcase innovation, build developer communities, and generate leads with technical content.",
      features: ["Technical content templates", "Developer community tools", "Lead generation automation", "Product launch campaigns"],
      icon: <Monitor className="w-10 h-10 text-blue-500" />,
      use_cases: [
        "Product feature announcements and tutorials",
        "Developer community engagement and support",
        "Technical thought leadership content creation",
        "SaaS trial conversion and onboarding automation"
      ]
    },
    {
      name: "Professional Services",
      title: "Build Authority and Generate Leads",
      description: "Establish thought leadership, showcase expertise, and nurture prospects with professional content.",
      features: ["Thought leadership tools", "Case study templates", "Client testimonial automation", "Lead nurturing"],
      icon: <Award className="w-10 h-10 text-purple-500" />,
      use_cases: [
        "Professional expertise showcasing and case studies",
        "Client testimonial collection and promotion",
        "Industry thought leadership content creation",
        "Professional networking and referral automation"
      ]
    }
  ]

  const advancedFeatures = [
    {
      title: "AI Content Generation",
      description: "Advanced GPT-4 powered content creation with brand voice training",
      details: "Generate unlimited posts, captions, hashtags, and campaign ideas",
      status: "Available"
    },
    {
      title: "Multi-Platform Publishing",
      description: "Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok, Pinterest support",
      details: "Cross-platform content adaptation and optimization",
      status: "Available"
    },
    {
      title: "Advanced Analytics",
      description: "Real-time performance tracking with predictive insights",
      details: "ROI measurement, competitor analysis, and growth forecasting",
      status: "Available"
    },
    {
      title: "Automation Workflows",
      description: "Complex automation rules and behavioral triggers",
      details: "DM automation, engagement workflows, and lead nurturing",
      status: "Available"
    },
    {
      title: "Team Collaboration",
      description: "Multi-user access with role-based permissions",
      details: "Approval workflows, content calendars, and task management",
      status: "Available"
    },
    {
      title: "API Integrations",
      description: "Connect with CRM, e-commerce, and marketing tools",
      details: "Zapier, Shopify, HubSpot, Salesforce, and 100+ integrations",
      status: "Available"
    },
    {
      title: "White-Label Solutions",
      description: "Custom branding for agencies and enterprise clients",
      details: "Custom domains, branded reports, and reseller programs",
      status: "Available"
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security with SOC 2 compliance",
      details: "End-to-end encryption, audit logs, and access controls",
      status: "Available"
    }
  ]

  const securityFeatures = [
    {
      title: "SOC 2 Type II Compliance",
      description: "Independently audited security controls and procedures",
      icon: <Shield className="w-8 h-8 text-green-500" />
    },
    {
      title: "GDPR & CCPA Compliant",
      description: "Full compliance with global privacy regulations",
      icon: <Lock className="w-8 h-8 text-blue-500" />
    },
    {
      title: "End-to-End Encryption",
      description: "256-bit AES encryption for all data at rest and in transit",
      icon: <Shield className="w-8 h-8 text-purple-500" />
    },
    {
      title: "ISO 27001 Certified",
      description: "International standard for information security management",
      icon: <Award className="w-8 h-8 text-orange-500" />
    }
  ]

  const faqItems = [
    {
      question: "How does VeeFore's AI content generation work?",
      answer: "VeeFore uses advanced GPT-4 technology combined with real-time social media trend analysis to generate content that resonates with your audience. Our AI is trained on millions of high-performing social media posts and continuously learns from current trends, viral content patterns, and your brand's unique voice. You can input your brand guidelines, target audience preferences, and content goals, and our AI will create posts, captions, hashtags, and even complete campaign strategies that align with your objectives."
    },
    {
      question: "Which social media platforms does VeeFore support?",
      answer: "VeeFore supports 20+ major social media platforms including Instagram, Facebook, Twitter (X), LinkedIn, YouTube, TikTok, Pinterest, Snapchat, Reddit, Discord, Telegram, WhatsApp Business, Google My Business, and emerging platforms. We continuously add support for new platforms and provide platform-specific optimization features to ensure your content performs well on each channel. Our cross-platform publishing feature automatically adapts your content format, sizing, and messaging for each platform's unique requirements."
    },
    {
      question: "Is my data secure with VeeFore?",
      answer: "Absolutely. Security is our top priority. VeeFore is SOC 2 Type II compliant, GDPR and CCPA compliant, and ISO 27001 certified. We use end-to-end 256-bit AES encryption for all data at rest and in transit, implement strict access controls, maintain comprehensive audit logs, and undergo regular third-party security assessments. Your social media accounts are connected using OAuth protocols, and we never store your social media passwords. All data is processed in compliance with international privacy regulations."
    },
    {
      question: "Can I customize the AI to match my brand voice?",
      answer: "Yes! VeeFore's AI can be extensively trained on your brand voice and style. You can upload examples of your existing content, define your brand personality, set tone preferences, specify industry terminology, and create custom content templates. The AI learns from your feedback and continuously improves its understanding of your brand. You can also create multiple brand voice profiles for different products, services, or target audiences, ensuring consistent messaging across all your social media activities."
    },
    {
      question: "What kind of analytics and reporting does VeeFore provide?",
      answer: "VeeFore offers comprehensive analytics including real-time performance tracking, engagement metrics, audience growth analysis, optimal posting time recommendations, competitor benchmarking, ROI measurement, conversion tracking, and predictive insights. You can create custom dashboards, set up automated reports, track specific KPIs, and access detailed analytics for individual posts, campaigns, or overall account performance. Our analytics integrate data from all connected platforms to provide a unified view of your social media performance."
    },
    {
      question: "How much does VeeFore cost and what's included?",
      answer: "VeeFore offers flexible pricing plans starting from $29/month for individuals and small businesses, $99/month for growing companies, and custom enterprise pricing for large organizations. All plans include AI content generation, multi-platform publishing, basic analytics, and customer support. Higher-tier plans add advanced analytics, team collaboration features, workflow automation, priority support, and custom integrations. We also offer a 14-day free trial with no credit card required, so you can explore all features before committing."
    }
  ]

  const resourceItems = [
    {
      title: "Getting Started Guide",
      description: "Complete onboarding tutorial with step-by-step setup instructions, best practices, and quick wins to get you started with VeeFore in under 30 minutes.",
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      type: "Tutorial",
      readTime: "15 min read"
    },
    {
      title: "Content Templates Library",
      description: "500+ professionally designed content templates for every industry, occasion, and content type. Includes captions, hashtag sets, and creative briefs.",
      icon: <Upload className="w-8 h-8 text-green-500" />,
      type: "Resources",
      readTime: "Browse library"
    },
    {
      title: "VeeFore Academy",
      description: "Comprehensive social media marketing courses, webinars, and certifications. Learn advanced strategies from industry experts and VeeFore specialists.",
      icon: <Award className="w-8 h-8 text-purple-500" />,
      type: "Education",
      readTime: "Self-paced"
    },
    {
      title: "API Documentation",
      description: "Complete developer documentation for VeeFore's REST API, webhooks, and integrations. Build custom solutions and automate your workflows.",
      icon: <Settings className="w-8 h-8 text-orange-500" />,
      type: "Technical",
      readTime: "Reference"
    },
    {
      title: "Community Forum",
      description: "Connect with 50,000+ VeeFore users, share strategies, get feedback on your content, and learn from successful social media campaigns.",
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      type: "Community",
      readTime: "Join discussions"
    },
    {
      title: "24/7 Support Center",
      description: "Get instant help with live chat, comprehensive knowledge base, video tutorials, and priority support for enterprise customers.",
      icon: <Bell className="w-8 h-8 text-red-500" />,
      type: "Support",
      readTime: "Instant help"
    }
  ]

  const successStories = [
    {
      company: "FreshFood Delivery",
      industry: "Food & Beverage",
      challenge: "Struggling to create engaging content for multiple locations and maintain consistent brand voice across social platforms.",
      solution: "Implemented VeeFore's AI content generation and multi-location management features with automated local content customization.",
      results: [
        "300% increase in social media engagement",
        "45% boost in online orders from social media",
        "Reduced content creation time by 80%",
        "Expanded to 15 new markets with consistent branding"
      ],
      metrics: {
        engagement: "+300%",
        orders: "+45%",
        time_saved: "80%",
        markets: "15 new"
      },
      testimonial: "VeeFore transformed how we handle social media across all our locations. The AI creates perfectly localized content while maintaining our brand voice.",
      author: "Jessica Martinez, Digital Marketing Director"
    },
    {
      company: "TechStartup Innovations",
      industry: "Technology",
      challenge: "Limited marketing team struggling to build brand awareness and generate qualified leads through social media channels.",
      solution: "Leveraged VeeFore's thought leadership content generation, lead nurturing automation, and advanced analytics for tech industry targeting.",
      results: [
        "500% increase in qualified leads from social media",
        "Built thought leadership with 50K+ followers",
        "90% reduction in content creation costs",
        "Achieved product-market fit through social insights"
      ],
      metrics: {
        leads: "+500%",
        followers: "50K+",
        cost_reduction: "90%",
        engagement_rate: "12.5%"
      },
      testimonial: "The AI-generated thought leadership content helped establish our founders as industry experts. Our lead quality improved dramatically.",
      author: "Michael Chang, Growth Marketing Manager"
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Perfect for individuals and small businesses starting their social media journey",
      features: [
        "AI content generation for 3 platforms",
        "Schedule up to 100 posts per month",
        "Basic analytics and reporting",
        "1 social media account per platform",
        "Email support",
        "Content templates library",
        "Basic automation workflows"
      ],
      limitations: [
        "Limited to 3 social platforms",
        "Basic analytics only",
        "Standard support response time"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "per month",
      description: "Ideal for growing businesses and marketing teams who need advanced features",
      features: [
        "AI content generation for all platforms",
        "Unlimited post scheduling",
        "Advanced analytics and insights",
        "Up to 5 accounts per platform",
        "Priority email and chat support",
        "Advanced automation workflows",
        "Team collaboration (up to 5 users)",
        "Custom brand voice training",
        "Competitor analysis",
        "Content performance optimization"
      ],
      limitations: [
        "Limited team members",
        "Standard API rate limits"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Comprehensive solution for large organizations with complex requirements",
      features: [
        "Everything in Professional",
        "Unlimited social media accounts",
        "Unlimited team members",
        "Custom AI model training",
        "White-label solutions",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations and API access",
        "Advanced security and compliance",
        "Custom reporting and dashboards",
        "Onboarding and training sessions"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-gray-900">
                <span className="text-purple-600">Vee</span>Fore
              </div>
              <div className="hidden md:flex space-x-6">
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Features</button>
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Integrations</button>
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Industries</button>
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Resources</button>
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</button>
                <button className="text-gray-700 hover:text-purple-600 transition-colors">Enterprise</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavigation('signin')}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Log in
              </button>
              <Button 
                onClick={() => handleNavigation('signup')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start your free trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              2025 #1 Social Media Suites • #1 Social Media Analytics • #1 Social Media Listening
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Drive real business impact<br />
              with real-time social insights.<br />
              <span className="text-red-500">VeeFore makes it easy.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Supercharge your social media strategy with AI-powered content creation, intelligent scheduling, 
              advanced analytics, and unified multi-platform management. Join 2.5M+ businesses growing with VeeFore.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button 
                onClick={() => handleNavigation('signup')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
              >
                Start your free trial
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
              >
                Request a demo
              </Button>
            </div>

            {/* Award Badges */}
            <div className="flex justify-center items-center space-x-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-900">2025</div>
                <div className="text-xs text-red-500">#1 Social Media Suites</div>
                <div className="text-xs text-red-500">#1 Social Media Analytics</div>
                <div className="text-xs text-red-500">#1 Social Media Listening</div>
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-white text-sm font-medium">veefore.com/dashboard</div>
                  <div></div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Dashboard Stats */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-green-600">6,783</div>
                            <div className="text-sm text-green-700">Total Impressions</div>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">2.3K</div>
                            <div className="text-sm text-blue-700">Engagements</div>
                          </div>
                          <Heart className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Platform Connections */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Platforms</h3>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg text-white text-center">
                        <div className="text-sm font-medium">Instagram</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg text-white text-center">
                        <div className="text-sm font-medium">Facebook</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-lg text-white text-center">
                        <div className="text-sm font-medium">Twitter</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-700 to-indigo-700 p-3 rounded-lg text-white text-center">
                        <div className="text-sm font-medium">LinkedIn</div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex space-x-4">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Bot className="w-4 h-4 mr-2" />
                        Generate with VeeGPT
                      </Button>
                      <Button variant="outline" className="border-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by millions worldwide</h2>
            <p className="text-lg text-gray-600">Join the global community of successful businesses using VeeFore</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What can VeeFore do for you? */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What can VeeFore do for you?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the transformative power of AI-driven social media management with real results from businesses like yours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500 mb-4">80%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">reduction in workload using VeeFore's AI content</div>
              <div className="text-sm text-gray-600">generation capabilities</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500 mb-4">500%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">growth across all social channels using VeeFore</div>
              <div className="text-sm text-gray-600">automation and optimization</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500 mb-4">2M+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">new followers on social media using VeeFore</div>
              <div className="text-sm text-gray-600">growth strategies and AI insights</div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">VeeFore</div>
            <div className="text-2xl font-bold text-gray-400">TechFlow</div>
            <div className="text-2xl font-bold text-gray-400">Global Solutions</div>
          </div>
        </div>
      </section>

      {/* Introducing VeeGPT */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-purple-600">Introducing VeeGPT:</span>{' '}
                <span className="text-gray-900">The AI trained on real-time social trends</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Introducing VeeGPT, our all-new AI assistant that scours live social feeds to help you create content, 
                analyze performance, and build campaigns based on what's happening online right now.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg font-semibold rounded-lg">
                  Try it for free
                </Button>
                <Button variant="outline" className="border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-600 px-8 py-3 text-lg font-semibold rounded-lg">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Bot className="w-8 h-8" />
                  <span className="text-xl font-bold">VeeGPT</span>
                  <span className="bg-white text-purple-600 px-2 py-1 rounded text-sm font-medium">BETA</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">💡 What's trending in my industry?</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">🚀 How can I boost engagement?</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">✍️ Draft a TikTok script</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">📝 Write an Instagram post</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-sm opacity-90">📅 Draft a posting schedule for next month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Save time section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Save time, simplify, and grow faster on social media
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VeeFore is designed to help you manage social media faster, smarter, and with way less effort.
            </p>
          </div>

          {/* Feature Sections */}
          <div className="space-y-24">
            {/* Content Creation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Start from scratch</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Save hours posting, creating, and analyzing content
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Schedule posts to go live anytime — even if you're fast asleep or on the beach. 
                  Plus, create content quickly with AI templates and have VeeGPT write your 
                  captions and hashtags for you. Then get the full picture with straightforward 
                  performance reports. Oh, and did we mention it's all in one (1) tab?
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Learn more
                </Button>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-100 rounded-lg p-4 text-center">
                      <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Calendar</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Content</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-3 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Fashion Spring Collection</div>
                        <div className="text-xs text-gray-500">Scheduled for 2:30 PM</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Behind the Scenes</div>
                        <div className="text-xs text-gray-500">Scheduled for 5:45 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Post Performance</h4>
                    <Button size="sm" variant="outline">Create report</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">6,783</div>
                      <div className="text-sm text-gray-500">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">15.38%</div>
                      <div className="text-sm text-gray-500">Engagement Rate</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Performance vs last week</span>
                      <span className="text-green-600 font-medium">+24.5%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Advanced Analytics</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Boost engagement, reach, and follower count with less effort
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  See the content that brings in the most engagement and revenue and measure 
                  how you're performing against your competitors. Plus, get personalized 
                  suggestions for how to win in your industry. And, with reports that show you the 
                  best time to post for every network, you can say goodbye to hop-scotching 
                  between network tabs for good.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Try it for free
                </Button>
              </div>
            </div>

            {/* Customer Service */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">Unified Inbox</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Deliver a better customer experience and keep your inbox tidy
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Reduce the clutter and eliminate DM dread with a unified social media inbox. 
                  Reply to comments and messages across platforms in one convenient hub and 
                  never leave your followers on read again. Cut your team's message volume with 
                  saved replies or level up with our AI chatbot add-on.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Learn more
                </Button>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                  <div className="bg-orange-100 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-orange-800 mb-2">SHARED INBOX</div>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="text-sm font-medium text-gray-900">All conversations</div>
                        <div className="text-xs text-gray-500">31 messages</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="text-sm font-medium text-gray-900">Assigned to me</div>
                        <div className="text-xs text-gray-500">12 messages</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Sandra Lewis</div>
                          <div className="text-xs text-gray-500">Instagram • 2m ago</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">Hi! I'm interested in applying for the PR Specialist position...</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Adrian Jung Silva</div>
                          <div className="text-xs text-gray-500">Facebook • 15m ago</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">Thanks for your response! Could you...</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Send message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive social media management platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage, grow, and optimize your social media presence across all platforms in one powerful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.slice(0, 6).map((feature, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 ${
                  activeFeature === index ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.slice(0, 4).map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Perfect for businesses of all sizes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From startups to enterprise organizations, VeeFore scales with your business needs and growth objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${useCase.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  {useCase.icon}
                </div>
                <div className={`text-sm font-medium text-${useCase.color}-600 uppercase tracking-wide mb-2`}>
                  {useCase.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Tailored solutions for every industry</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-specific features and templates designed to meet the unique challenges and opportunities in your sector.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                    {industry.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{industry.name}</h3>
                    <p className="text-gray-600">{industry.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Key Features</h4>
                    <ul className="space-y-2">
                      {industry.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Use Cases</h4>
                    <ul className="space-y-2">
                      {industry.use_cases.map((useCase, useCaseIndex) => (
                        <li key={useCaseIndex} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Complete feature ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the powerful features that make VeeFore the most comprehensive social media management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                    {feature.status}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <p className="text-xs text-gray-500">{feature.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-grade security & compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your data security and privacy are our top priorities. VeeFore meets the highest standards for enterprise security and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg">
              Learn about our security practices
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What our customers are saying</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their social media strategy with VeeFore.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 ${
                  activeTestimonial === index ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-lg font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-purple-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(testimonial.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-purple-600">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Customer success stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real businesses achieving extraordinary results with VeeFore. See how our platform transforms social media strategies.
            </p>
          </div>

          <div className="space-y-16">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-12">
                    <div className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-2">
                      {story.industry}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{story.company}</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h4>
                        <p className="text-gray-600">{story.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Solution</h4>
                        <p className="text-gray-600">{story.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Results</h4>
                        <ul className="space-y-2">
                          {story.results.map((result, resultIndex) => (
                            <li key={resultIndex} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <blockquote className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-500">
                      <p className="text-gray-700 italic mb-3">"{story.testimonial}"</p>
                      <footer className="text-sm text-gray-600 font-medium">{story.author}</footer>
                    </blockquote>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-12 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                      {Object.entries(story.metrics).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-xl p-6 text-center shadow-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">
              Get answers to the most common questions about VeeFore's features, pricing, and capabilities.
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Resources for social media professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive resources, guides, and support to maximize your success with VeeFore and social media marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceItems.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {resource.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600 uppercase tracking-wide">{resource.type}</div>
                    <div className="text-xs text-gray-500">{resource.readTime}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{resource.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white group-hover:scale-105 transition-transform">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Explore Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your business. Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl border-2 p-8 hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-lg scale-105 relative' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 text-lg font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={() => handleNavigation('signup')}
                >
                  {plan.cta}
                </Button>
                
                {plan.limitations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="text-xs text-gray-400">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required • Cancel anytime</p>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-600">
              Compare all features
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your social media strategy?
          </h2>
          <p className="text-xl opacity-90 mb-12 leading-relaxed">
            Join over 2.5 million businesses worldwide who trust VeeFore to grow their social media presence. 
            Start your free trial today and experience the power of AI-driven social media management.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              onClick={() => handleNavigation('signup')}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
            >
              Start your free trial
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
            >
              Book a demo
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm opacity-75">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-purple-400">Vee</span>Fore
              </div>
              <p className="text-gray-400 mb-6">
                The most comprehensive social media management platform powered by AI.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 VeeFore. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing