import { useState, useEffect } from 'react'
import { ChevronDown, Play, Star, TrendingUp, Users, Zap, Shield, Target, Globe, ArrowRight, Check, Building2, BarChart3, Calendar, MessageSquare, Bot, Award, Clock, Eye, Heart, Share2, Trending, DollarSign, Lightbulb, Rocket, Filter, Search, Bell, Settings, Upload, Download, Lock, Smartphone, Laptop, Monitor, Sparkles, Crown, Diamond, Layers, Infinity, Cpu, Brain, Network, Wand2, Palette, Music, Video, Image, FileText, Mic, Camera, Megaphone, Compass, Map, Database, Code, Server, Cloud, Gauge, LineChart, PieChart, Activity, Headphones, ShoppingCart, CreditCard, Wallet, ChevronRight, ExternalLink, Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import veeGptImage from '@assets/generated_images/VeeGPT_chat_interface_mockup_787cf02f.png'
import videoGenImage from '@assets/generated_images/AI_video_generator_interface_afe92185.png'
import analyticsImage from '@assets/generated_images/Social_media_analytics_dashboard_6db9ea53.png'
import contentImage from '@assets/generated_images/Content_creation_interface_bfe4cd5e.png'

interface LandingProps {
  onNavigate: (view: string) => void
}

const Landing = ({ onNavigate }: LandingProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 8)
    }, 4000)

    // Scroll effect
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavigation = (page: string) => {
    onNavigate(page)
  }

  // Modern feature showcase with real screenshots
  const platformFeatures = [
    {
      id: "veegpt",
      title: "VeeGPT",
      subtitle: "AI Chat Assistant",
      description: "Conversational AI that understands context, generates content, and helps with strategy. ChatGPT-like interface designed for creators.",
      image: veeGptImage,
      icon: <Bot className="w-8 h-8" />,
      color: "from-violet-500 to-purple-600",
      features: ["Real-time streaming responses", "Context-aware conversations", "Content generation", "Strategy assistance"],
      link: "/veegpt"
    },
    {
      id: "video-gen",
      title: "AI Video Studio",
      subtitle: "Cosmos Video Generator",
      description: "Professional AI video creation with automated scripts, scenes, voiceovers, and editing. Create viral content in minutes.",
      image: videoGenImage,
      icon: <Video className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      features: ["AI script generation", "Automated scene creation", "Professional voiceovers", "Smart editing"],
      link: "/video-generator"
    },
    {
      id: "analytics",
      title: "Analytics Pro",
      subtitle: "Deep Performance Insights",
      description: "Comprehensive analytics dashboard with real-time metrics, engagement tracking, and predictive insights for growth optimization.",
      image: analyticsImage,
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      features: ["Real-time metrics", "Engagement tracking", "Growth predictions", "ROI analysis"],
      link: "/analytics"
    },
    {
      id: "content",
      title: "Content Studio",
      subtitle: "Smart Content Creation",
      description: "AI-powered content creation suite with intelligent scheduling, hashtag optimization, and multi-platform publishing.",
      image: contentImage,
      icon: <Palette className="w-8 h-8" />,
      color: "from-orange-500 to-pink-500",
      features: ["Smart scheduling", "Hashtag optimization", "Multi-platform", "Brand consistency"],
      link: "/create"
    },
    {
      id: "automation",
      title: "Smart Automation",
      subtitle: "Intelligent Workflows",
      description: "Advanced automation engine for comments, DMs, engagement, and audience growth with AI-powered responses.",
      image: "/api/placeholder/600/400",
      icon: <Zap className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      features: ["Comment automation", "DM responses", "Engagement boost", "Audience growth"],
      link: "/automation"
    },
    {
      id: "inbox",
      title: "Unified Inbox",
      subtitle: "Social Conversations",
      description: "Centralized inbox for all social media interactions with AI-powered response suggestions and priority management.",
      image: "/api/placeholder/600/400",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-500",
      features: ["Unified conversations", "AI responses", "Priority sorting", "Team collaboration"],
      link: "/inbox"
    },
    {
      id: "calendar",
      title: "Smart Calendar",
      subtitle: "Content Planning",
      description: "Intelligent content calendar with optimal posting times, trend integration, and collaborative planning tools.",
      image: "/api/placeholder/600/400",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      features: ["Optimal timing", "Trend integration", "Team planning", "Content queue"],
      link: "/plan"
    },
    {
      id: "growth",
      title: "Growth Engine",
      subtitle: "Audience Building",
      description: "AI-driven audience growth strategies with competitor analysis, influencer discovery, and engagement optimization.",
      image: "/api/placeholder/600/400",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      features: ["Growth strategies", "Competitor analysis", "Influencer discovery", "Engagement optimization"],
      link: "/growth"
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Modern Navigation */}
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

      {/* Hero Section - Ultra Modern */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-60 h-60 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-blue-100 rounded-full px-6 py-3 mb-8 border border-violet-200/50">
              <Rocket className="w-5 h-5 text-violet-600 mr-2" />
              <span className="text-violet-800 font-semibold">Launching Soon • AI-Powered Social Media Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-violet-800 to-blue-800 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Social Media
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI platform that automates content creation, video generation, analytics, and audience growth. 
              Built for creators, businesses, and agencies who want to dominate social media.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => handleNavigation('veegpt')}
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Bot className="w-6 h-6 mr-3" />
                Try VeeGPT Now
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-gray-300 hover:border-violet-300 text-gray-700 hover:text-violet-700 px-10 py-4 text-lg font-semibold rounded-xl hover:bg-violet-50 transition-all duration-300"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>

            {/* Platform Preview - Featured Interface */}
            <div className="relative max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white font-semibold">VeeFore AI Platform</span>
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

      {/* Platform Features Grid - Modern Cards */}
      <section id="platform" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-violet-100 rounded-full px-6 py-3 mb-8">
              <Cpu className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold">Complete AI Platform</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI chat assistance to professional video generation - all integrated into one powerful platform
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-200/50 hover:border-violet-200 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                  hoveredFeature === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => handleNavigation(feature.link.replace('/', ''))}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">{feature.subtitle}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {feature.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-violet-600 font-semibold group-hover:text-violet-700 transition-colors">
                  <span>Explore {feature.title}</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Preview Image */}
                <div className="absolute inset-x-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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

      {/* Why Choose VeeFore Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 rounded-full px-6 py-3 mb-8">
              <Crown className="w-5 h-5 text-violet-600 mr-2" />
              <span className="text-violet-800 font-semibold">Why VeeFore?</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Built for Scale
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only platform that combines AI chat, video generation, analytics, and automation in one unified system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* AI-First */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-First Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Every feature is powered by advanced AI. From VeeGPT chat to automated video generation, we use cutting-edge models to deliver results.
              </p>
            </div>

            {/* All-in-One */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Layers className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Solution</h3>
              <p className="text-gray-600 leading-relaxed">
                No need for multiple tools. Content creation, video generation, analytics, automation, and chat assistance all in one platform.
              </p>
            </div>

            {/* Enterprise Ready */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Ready</h3>
              <p className="text-gray-600 leading-relaxed">
                Built for teams and agencies. Role management, collaboration tools, white-label options, and enterprise-grade security.
              </p>
            </div>
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
              Start with VeeGPT
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
            <p className="text-lg">🚀 Join thousands of creators already using VeeFore</p>
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
              <p className="text-gray-400 leading-relaxed">
                The future of social media management. AI-powered platform for creators, businesses, and agencies.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">VeeGPT</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Studio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Automation</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 VeeFore. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
