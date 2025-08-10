import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Crown, Clock, Gift, Share2, Copy, Check, Users, TrendingUp, 
  Star, Calendar, Mail, Trophy, Zap, Sparkles, BarChart3, 
  Globe, BookOpen, MessageSquare, HeartHandshake, PartyPopper, 
  Gem, Diamond, ArrowLeft, Rocket, Shield, Bell, Settings, 
  Download, Play, Eye, Zap as Lightning, Cpu, Orbit, 
  Radio, Waves, Network, Hexagon, Triangle, Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  credits: number;
  status: string;
  joinedAt: string;
  position?: number;
  metadata?: {
    questionnaire?: any;
  };
}

// Floating geometric shapes component
const FloatingShapes = () => {
  const shapes = [
    { Component: Circle, delay: 0, duration: 20, x: '10%', y: '20%' },
    { Component: Triangle, delay: 2, duration: 25, x: '80%', y: '10%' },
    { Component: Hexagon, delay: 4, duration: 22, x: '20%', y: '70%' },
    { Component: Diamond, delay: 6, duration: 18, x: '70%', y: '80%' },
    { Component: Circle, delay: 8, duration: 24, x: '90%', y: '50%' },
    { Component: Triangle, delay: 10, duration: 26, x: '5%', y: '90%' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute opacity-5"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <shape.Component className="w-16 h-16 text-purple-400" />
        </motion.div>
      ))}
    </div>
  );
};

// Animated particle system
const ParticleSystem = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const WaitlistStatus = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<WaitlistUser | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    avgWaitTime: '2-3 weeks',
    launchProgress: 78
  });
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Motion values for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    
    if (userId) {
      fetchUserData(userId);
    } else {
      setLocation('/waitlist');
    }

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/early-access/status/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setTimeout(() => setShowSuccessModal(false), 4000);
      } else {
        toast({
          title: "Error",
          description: "Could not load your waitlist status.",
          variant: "destructive",
        });
        setLocation('/waitlist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLocation('/waitlist');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!user?.referralCode) return;
    
    try {
      await navigator.clipboard.writeText(`https://veefore.com/waitlist?ref=${user.referralCode}`);
      setCopiedReferral(true);
      toast({
        title: "Referral link copied!",
        description: "Share it with friends to skip ahead in line.",
      });
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <ParticleSystem />
        <motion.div className="relative">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-2 w-16 h-16 border-2 border-blue-400 border-b-transparent rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <FloatingShapes />
      <ParticleSystem />
      
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyNywgNjMsIDIzNSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-20"></div>

      {/* Success Modal with Enhanced Design */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-slate-800 to-purple-900 border-2 border-purple-500/30 shadow-2xl backdrop-blur-xl">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.3, 
                    type: "spring", 
                    stiffness: 300,
                    damping: 15 
                  }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <PartyPopper className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 border-4 border-dashed border-yellow-400/50 rounded-full"
                  />
                </motion.div>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    🚀 Welcome to the Future!
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-lg leading-relaxed">
                    You've just joined the most exclusive AI revolution in social media. Prepare for an experience that will redefine content creation forever.
                  </DialogDescription>
                </DialogHeader>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Innovative Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                >
                  <Cpu className="w-7 h-7 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-75 blur"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                  VeeFore
                </h1>
                <p className="text-sm text-gray-400">Neural Dashboard</p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/waitlist')}
                className="text-white hover:text-purple-400 hover:bg-white/10 backdrop-blur"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Neural Exit
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Revolutionary Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-12"
        >
          <motion.div 
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-pink-600/20 backdrop-blur-xl border border-white/20 shadow-2xl p-12"
            onHoverStart={() => setHoveredCard('hero')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            {/* Animated background mesh */}
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
              style={{
                backgroundSize: "400% 400%",
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-yellow-400/30"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Crown className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <span className="text-yellow-400 font-bold">NEURAL VIP ACCESS</span>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent leading-tight"
              >
                Hello, {user?.name || 'Creator'}! 
                <motion.span
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="inline-block ml-4"
                >
                  👋
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-2xl text-gray-300 mb-10 max-w-3xl leading-relaxed"
              >
                You've entered the <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">neural frontier</span> of content creation. 
                Your AI-powered journey starts here.
              </motion.p>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    icon: Trophy, 
                    label: "Queue Position", 
                    value: "#1", 
                    subtitle: "Neural Priority", 
                    gradient: "from-yellow-400 to-orange-500",
                    delay: 1.1 
                  },
                  { 
                    icon: Lightning, 
                    label: "Activation Time", 
                    value: "2-3 weeks", 
                    subtitle: "Quantum Processing", 
                    gradient: "from-green-400 to-emerald-500",
                    delay: 1.3 
                  },
                  { 
                    icon: Network, 
                    label: "Neural Links", 
                    value: `${user?.referralCount || 0}`, 
                    subtitle: "Connections Made", 
                    gradient: "from-purple-400 to-pink-500",
                    delay: 1.5 
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: stat.delay, 
                      type: "spring", 
                      stiffness: 200,
                      damping: 15 
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      transition: { duration: 0.2 } 
                    }}
                    className="relative group"
                  >
                    <div className={`bg-gradient-to-br ${stat.gradient}/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                      <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.subtitle}</div>
                      
                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Neural Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Neural Interface */}
          <div className="lg:col-span-8 space-y-8">
            {/* Progress Neural Network */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-xl border-purple-500/30 shadow-2xl overflow-hidden">
                <CardHeader className="relative">
                  <motion.div
                    animate={{ 
                      background: [
                        "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                        "linear-gradient(45deg, #8b5cf6, #ec4899)",
                        "linear-gradient(45deg, #ec4899, #3b82f6)"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute inset-0 opacity-10"
                  />
                  <div className="relative flex items-center space-x-4">
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgb(59, 130, 246)",
                          "0 0 30px rgb(139, 92, 246)",
                          "0 0 20px rgb(236, 72, 153)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    >
                      <Orbit className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-1">Neural Progress</CardTitle>
                      <p className="text-gray-400">Quantum synchronization active</p>
                    </div>
                    <div className="flex-1" />
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300 font-medium">Initialization Progress</span>
                      <span className="text-purple-400 font-bold">#1 of {stats.totalUsers}</span>
                    </div>
                    
                    <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      />
                      <motion.div
                        animate={{ x: ["0%", "300%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-y-0 left-0 w-1/4 bg-white/30 rounded-full blur-sm"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Neural sync: {new Date(user?.joinedAt || '').toLocaleDateString()}</span>
                      <span>Quantum ready</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { 
                        icon: Rocket, 
                        label: "Launch Vector", 
                        value: `${stats.launchProgress}%`,
                        color: "blue" 
                      },
                      { 
                        icon: Shield, 
                        label: "Access Level", 
                        value: "NEURAL",
                        color: "purple" 
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                      >
                        <div className={`w-10 h-10 bg-${item.color}-500/20 rounded-xl flex items-center justify-center mb-3`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                        <div className="text-sm text-gray-400">{item.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Neural Referral System */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-xl border-pink-500/30 shadow-2xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        boxShadow: [
                          "0 0 20px rgb(236, 72, 153)",
                          "0 0 30px rgb(168, 85, 247)",
                          "0 0 20px rgb(236, 72, 153)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center"
                    >
                      <Waves className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-1">Neural Network Expansion</CardTitle>
                      <p className="text-gray-400">Propagate the revolution</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-2xl p-8 border border-purple-400/20">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Neural Access Code</h3>
                        <p className="text-gray-400">Each connection accelerates the timeline</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-purple-400">{user?.referralCount || 0}</div>
                        <div className="text-sm text-gray-400">neural links</div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-4 p-6 bg-black/30 rounded-xl border border-purple-400/30 backdrop-blur-sm"
                      >
                        <code className="flex-1 text-xl font-mono font-bold text-purple-400 tracking-wider">
                          {user?.referralCode || 'LOADING...'}
                        </code>
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            onClick={copyReferralCode}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                          >
                            {copiedReferral ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Neural Sync!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Clone Code
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </motion.div>
                      
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                      <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-lg">
                        <Share2 className="w-5 h-5 mr-2" />
                        Neural Broadcast
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        className="w-full h-14 border-2 border-purple-400/50 hover:bg-purple-400/10 text-white rounded-xl text-lg"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Quantum Mail
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Neural Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* System Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="bg-gradient-to-br from-emerald-800/30 to-blue-800/30 backdrop-blur-xl border-emerald-500/30 shadow-2xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center"
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">Neural Perks</CardTitle>
                      <p className="text-gray-400 text-sm">System advantages</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      icon: Gift, 
                      title: "50% Neural Discount", 
                      subtitle: "Early adopter pricing",
                      gradient: "from-emerald-400 to-teal-500"
                    },
                    { 
                      icon: Lightning, 
                      title: "Quantum Support", 
                      subtitle: "Instant neural assistance",
                      gradient: "from-blue-400 to-cyan-500"
                    },
                    { 
                      icon: Gem, 
                      title: "Beta Neural Tools", 
                      subtitle: "Advanced AI features",
                      gradient: "from-purple-400 to-indigo-500"
                    },
                    { 
                      icon: Diamond, 
                      title: "Founder Neural ID", 
                      subtitle: "Eternal recognition",
                      gradient: "from-pink-400 to-rose-500"
                    }
                  ].map((perk, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 bg-gradient-to-r ${perk.gradient} rounded-xl flex items-center justify-center`}
                      >
                        <perk.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <div className="font-semibold text-white">{perk.title}</div>
                        <div className="text-sm text-gray-400">{perk.subtitle}</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Neural Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-xl border-gray-500/30 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          "0 0 15px rgb(34, 197, 94)",
                          "0 0 25px rgb(59, 130, 246)",
                          "0 0 15px rgb(34, 197, 94)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center"
                    >
                      <Globe className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">Neural Network</CardTitle>
                      <p className="text-gray-400 text-sm">Live metrics</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-500/20">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-3xl font-black text-white mb-1"
                      >
                        {stats.totalUsers.toLocaleString()}
                      </motion.div>
                      <div className="text-sm text-gray-400 mb-2">Neural Nodes</div>
                      <div className="flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400 font-medium">+247 today</span>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/20">
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl font-black text-white mb-1"
                      >
                        {stats.avgWaitTime}
                      </motion.div>
                      <div className="text-sm text-gray-400 mb-2">Neural Sync Time</div>
                      <div className="flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-xs text-blue-400 font-medium">Optimizing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Neural Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="space-y-4"
            >
              {[
                { icon: Bell, label: "Neural Alerts", gradient: "from-yellow-600 to-orange-600" },
                { icon: Download, label: "Neural App", gradient: "from-green-600 to-emerald-600" },
                { icon: Settings, label: "Neural Config", gradient: "from-gray-600 to-slate-600" }
              ].map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className={`w-full h-14 bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white rounded-xl text-lg shadow-lg`}>
                    <action.icon className="w-5 h-5 mr-3" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Neural Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-16 text-center py-8 border-t border-white/10"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Questions about your neural journey?{' '}
            <a href="mailto:neural@veefore.com" className="text-purple-400 hover:text-purple-300 font-bold underline decoration-purple-400/50">
              neural@veefore.com
            </a>
          </p>
          <div className="flex items-center justify-center space-x-8">
            {[
              { icon: MessageSquare, label: "Neural Chat" },
              { icon: BookOpen, label: "Neural Docs" },
              { icon: HeartHandshake, label: "Neural Community" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="lg" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistStatus;