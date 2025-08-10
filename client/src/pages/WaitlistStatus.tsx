import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Crown, Clock, Gift, Share2, Copy, Check, Users, TrendingUp, 
  Star, Calendar, Mail, Trophy, Zap, 
  Sparkles, BarChart3, Globe, BookOpen, MessageSquare, HeartHandshake, 
  PartyPopper, Gem, Diamond, ArrowLeft, Rocket, Shield,
  Bell, Settings, Download, Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    
    if (userId) {
      fetchUserData(userId);
    } else {
      setLocation('/waitlist');
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/early-access/status/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setTimeout(() => setShowSuccessModal(false), 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="max-w-md mx-auto bg-white border-0 shadow-2xl">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <PartyPopper className="w-8 h-8 text-white" />
                </motion.div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 Welcome to VeeFore!
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 text-base leading-relaxed">
                    You're now part of our exclusive community! Get ready to revolutionize your social media presence with cutting-edge AI tools.
                  </DialogDescription>
                </DialogHeader>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VeeFore</h1>
                <p className="text-sm text-gray-500">Waitlist Status</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/waitlist')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Waitlist
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">VIP Member</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome, {user?.name || 'Creator'}! 👋
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                You're part of something revolutionary. Get ready to transform your content creation with AI-powered tools that adapt to your unique style.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                    </div>
                    <span className="text-sm text-blue-100">Your Position</span>
                  </div>
                  <div className="text-3xl font-bold">#1</div>
                  <p className="text-sm text-blue-200">100% ahead in queue</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="text-sm text-blue-100">Est. Wait Time</span>
                  </div>
                  <div className="text-3xl font-bold">2-3 weeks</div>
                  <p className="text-sm text-blue-200">Early access priority</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-400/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-300" />
                    </div>
                    <span className="text-sm text-blue-100">Referrals</span>
                  </div>
                  <div className="text-3xl font-bold">{user?.referralCount || 0}</div>
                  <p className="text-sm text-blue-200">Friends invited</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">Your Progress</CardTitle>
                        <p className="text-gray-600">Track your journey to launch</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Queue Position</span>
                      <span className="text-sm font-bold text-blue-600">#1 of {stats.totalUsers}</span>
                    </div>
                    <div className="relative">
                      <Progress value={100} className="h-3 bg-gray-100" />
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Joined {new Date(user?.joinedAt || '').toLocaleDateString()}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Rocket className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">{stats.launchProgress}%</div>
                      <div className="text-xs text-gray-600">Launch Progress</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">VIP</div>
                      <div className="text-xs text-gray-600">Access Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Referral System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Skip the Line</CardTitle>
                      <p className="text-gray-600">Invite friends and jump ahead faster</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Referral Code</h3>
                        <p className="text-gray-600 text-sm">Each friend moves you up 5 positions</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{user?.referralCount || 0}</div>
                        <div className="text-sm text-gray-500">referrals</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-purple-200">
                      <code className="flex-1 text-lg font-mono font-bold text-purple-700">
                        {user?.referralCode || 'LOADING...'}
                      </code>
                      <Button
                        onClick={copyReferralCode}
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        {copiedReferral ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 h-12 rounded-xl"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on Social
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-200 hover:bg-gray-50 h-12 rounded-xl"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Friends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Launch Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Launch Roadmap</CardTitle>
                      <p className="text-gray-600">What's coming next</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { phase: "Beta Testing", status: "current", date: "This Month", icon: Play },
                      { phase: "VIP Early Access", status: "upcoming", date: "Next Month", icon: Crown },
                      { phase: "Public Launch", status: "planned", date: "Q2 2025", icon: Rocket }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.status === 'current' ? 'bg-blue-500' :
                          item.status === 'upcoming' ? 'bg-orange-400' : 'bg-gray-400'
                        }`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.phase}</h4>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </div>
                        {item.status === 'current' && (
                          <Badge className="bg-blue-100 text-blue-700">Current</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Your Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border border-orange-100">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Your Benefits</CardTitle>
                      <p className="text-gray-600 text-sm">Exclusive perks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Gift, title: "50% Launch Discount", subtitle: "Early bird pricing", color: "emerald" },
                    { icon: Zap, title: "Priority Support", subtitle: "24/7 dedicated help", color: "blue" },
                    { icon: Gem, title: "Exclusive Features", subtitle: "Beta access to new tools", color: "purple" },
                    { icon: Diamond, title: "Founder Status", subtitle: "Lifetime recognition", color: "pink" }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-orange-100/50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${benefit.color}-500`}>
                        <benefit.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{benefit.title}</div>
                        <div className="text-xs text-gray-600">{benefit.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Community</CardTitle>
                      <p className="text-gray-600 text-sm">Live stats</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Members</div>
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">+247 today</span>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                      <div className="text-2xl font-bold text-gray-900">{stats.avgWaitTime}</div>
                      <div className="text-sm text-gray-600">Avg. Wait Time</div>
                      <div className="flex items-center justify-center mt-2">
                        <Clock className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-600 font-medium">Decreasing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-3"
            >
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 h-12 rounded-xl">
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
              <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 h-12 rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Download App
              </Button>
              <Button variant="ghost" className="w-full hover:bg-gray-50 h-12 rounded-xl">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center py-8 border-t border-gray-200"
        >
          <p className="text-gray-600 mb-4">
            Questions? We're here to help at{' '}
            <a href="mailto:support@veefore.com" className="text-blue-600 hover:underline font-medium">
              support@veefore.com
            </a>
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
            <Button variant="ghost" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Help Center
            </Button>
            <Button variant="ghost" size="sm">
              <HeartHandshake className="w-4 h-4 mr-2" />
              Community
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistStatus;