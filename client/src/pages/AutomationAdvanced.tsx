import React, { useState } from 'react'
import { 
  Instagram, 
  Bot, 
  MessageCircle, 
  User, 
  Heart, 
  Send, 
  Bookmark, 
  Camera, 
  MoreHorizontal, 
  CheckCircle,
  Settings,
  Brain,
  Sparkles,
  Plus,
  X,
  Eye,
  Hash,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ChevronDown,
  Image,
  Video,
  FileText,
  Layers,
  Calendar,
  Clock,
  Target,
  Users,
  Zap,
  Filter,
  PlayCircle,
  Music,
  Type,
  Palette,
  UserPlus,
  Share2,
  Bell,
  TrendingUp,
  Shield,
  BarChart3,
  Globe,
  Timer,
  AtSign,
  Search,
  Activity,
  Repeat,
  Star,
  MessageSquare,
  Play,
  Pause,
  ChevronRight
} from 'lucide-react'

export default function AutomationAdvanced() {
  console.log('AutomationAdvanced component loaded successfully')
  
  // Main automation settings
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedPost, setSelectedPost] = useState('')
  const [automationType, setAutomationType] = useState('comment_dm')
  const [isActive, setIsActive] = useState(true)
  const [activeTab, setActiveTab] = useState('setup')
  
  // Comment & DM Automation
  const [keywords, setKeywords] = useState(['info', 'price', 'link'])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('Check your DMs for more info! 📩')
  const [dmMessage, setDmMessage] = useState('Thanks for your interest! Here\'s more information about our services.')
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  
  // Auto-Follow Settings
  const [autoFollowEnabled, setAutoFollowEnabled] = useState(false)
  const [followTargetAccounts, setFollowTargetAccounts] = useState(['@competitor1', '@competitor2'])
  const [followersPerDay, setFollowersPerDay] = useState(50)
  const [followDelayMin, setFollowDelayMin] = useState(30)
  const [followDelayMax, setFollowDelayMax] = useState(120)
  const [unfollowAfterDays, setUnfollowAfterDays] = useState(7)
  const [followRatio, setFollowRatio] = useState(1.5)
  
  // Auto-Like Settings
  const [autoLikeEnabled, setAutoLikeEnabled] = useState(false)
  const [likeTargetHashtags, setLikeTargetHashtags] = useState(['#fitness', '#motivation'])
  const [likesPerHour, setLikesPerHour] = useState(20)
  const [likeDelayMin, setLikeDelayMin] = useState(10)
  const [likeDelayMax, setLikeDelayMax] = useState(60)
  const [avoidBusinessAccounts, setAvoidBusinessAccounts] = useState(false)
  
  // Story Automation
  const [storyAutoReply, setStoryAutoReply] = useState(false)
  const [storyKeywords, setStoryKeywords] = useState(['info', 'link'])
  const [storyReplyMessage, setStoryReplyMessage] = useState('Thanks for watching! Check your DMs 📩')
  const [storyViewBack, setStoryViewBack] = useState(true)
  
  // Auto-Share & Repost
  const [autoShareEnabled, setAutoShareEnabled] = useState(false)
  const [shareToStories, setShareToStories] = useState(true)
  const [shareToFeed, setShareToFeed] = useState(false)
  const [shareHashtags, setShareHashtags] = useState(['#repost', '#share'])
  const [shareCredits, setShareCredits] = useState(true)
  
  // Content Interaction
  const [autoCommentEnabled, setAutoCommentEnabled] = useState(false)
  const [commentTemplates, setCommentTemplates] = useState(['Great content! 👍', 'Love this! 💕', 'Amazing work! 🔥'])
  const [commentTargetAccounts, setCommentTargetAccounts] = useState(['@influencer1', '@brand1'])
  const [commentsPerPost, setCommentsPerPost] = useState(1)
  
  // Advanced Targeting
  const [targetFollowers, setTargetFollowers] = useState(true)
  const [targetNonFollowers, setTargetNonFollowers] = useState(true)
  const [targetVerified, setTargetVerified] = useState(false)
  const [targetBusinessAccounts, setTargetBusinessAccounts] = useState(true)
  const [excludeCompetitors, setExcludeCompetitors] = useState(true)
  const [minFollowersTarget, setMinFollowersTarget] = useState(100)
  const [maxFollowersTarget, setMaxFollowersTarget] = useState(10000)
  const [targetGender, setTargetGender] = useState('all')
  const [targetAge, setTargetAge] = useState('all')
  const [targetLocation, setTargetLocation] = useState('all')
  
  // Timing & Scheduling
  const [scheduleActive, setScheduleActive] = useState(false)
  const [activeHours, setActiveHours] = useState({ start: '09:00', end: '18:00' })
  const [activeDays, setActiveDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
  const [timezone, setTimezone] = useState('America/New_York')
  const [peakHoursOnly, setPeakHoursOnly] = useState(false)
  const [weekendsActive, setWeekendsActive] = useState(false)
  
  // AI & Personalization
  const [aiPersonality, setAiPersonality] = useState('professional')
  const [useAiPersonalization, setUseAiPersonalization] = useState(true)
  const [aiLearningEnabled, setAiLearningEnabled] = useState(true)
  const [responseVariations, setResponseVariations] = useState(3)
  const [aiContextAwareness, setAiContextAwareness] = useState(true)
  const [aiSentimentAnalysis, setAiSentimentAnalysis] = useState(true)
  const [aiLanguageDetection, setAiLanguageDetection] = useState(true)
  
  // Safety & Limits
  const [maxRepliesPerDay, setMaxRepliesPerDay] = useState(50)
  const [cooldownPeriod, setCooldownPeriod] = useState(60)
  const [maxFollowsPerDay, setMaxFollowsPerDay] = useState(50)
  const [maxLikesPerDay, setMaxLikesPerDay] = useState(200)
  const [maxCommentsPerDay, setMaxCommentsPerDay] = useState(30)
  const [respectRateLimits, setRespectRateLimits] = useState(true)
  const [humanizedDelays, setHumanizedDelays] = useState(true)
  const [accountSafety, setAccountSafety] = useState('high')
  
  // Analytics & Reporting
  const [trackEngagement, setTrackEngagement] = useState(true)
  const [trackFollowerGrowth, setTrackFollowerGrowth] = useState(true)
  const [trackConversions, setTrackConversions] = useState(true)
  const [dailyReports, setDailyReports] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [realTimeAlerts, setRealTimeAlerts] = useState(true)
  const [performanceGoals, setPerformanceGoals] = useState(true)
  
  // Webhook & Integration
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [slackIntegration, setSlackIntegration] = useState(false)
  const [discordIntegration, setDiscordIntegration] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  
  // Data structures
  const platforms = [
    { id: 'Instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { id: 'Facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { id: 'Twitter', name: 'Twitter', icon: <Twitter className="w-4 h-4" /> },
    { id: 'LinkedIn', name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { id: 'Youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" /> }
  ]

  const automationTypes = [
    { 
      id: 'comment_dm', 
      name: 'Comment → DM', 
      icon: <MessageCircle className="w-4 h-4" />, 
      description: 'Reply to comments and send DMs' 
    },
    { 
      id: 'auto_follow', 
      name: 'Auto Follow', 
      icon: <UserPlus className="w-4 h-4" />, 
      description: 'Automatically follow targeted accounts' 
    },
    { 
      id: 'auto_like', 
      name: 'Auto Like', 
      icon: <Heart className="w-4 h-4" />, 
      description: 'Like posts with specific hashtags' 
    },
    { 
      id: 'story_automation', 
      name: 'Story Automation', 
      icon: <PlayCircle className="w-4 h-4" />, 
      description: 'Auto-reply to story mentions' 
    },
    { 
      id: 'auto_share', 
      name: 'Auto Share', 
      icon: <Share2 className="w-4 h-4" />, 
      description: 'Repost and share content automatically' 
    },
    { 
      id: 'content_interaction', 
      name: 'Content Interaction', 
      icon: <MessageSquare className="w-4 h-4" />, 
      description: 'Comment on targeted posts' 
    },
    { 
      id: 'follower_management', 
      name: 'Follower Management', 
      icon: <Users className="w-4 h-4" />, 
      description: 'Manage follow/unfollow ratios' 
    },
    { 
      id: 'growth_optimization', 
      name: 'Growth Optimization', 
      icon: <TrendingUp className="w-4 h-4" />, 
      description: 'AI-powered growth strategies' 
    }
  ]

  const mockAccounts = [
    { id: 'acc1', name: '@arpit9996363', followers: '9 followers', platform: 'Instagram' },
    { id: 'acc2', name: '@rahulc1020', followers: '4 followers', platform: 'Instagram' },
    { id: 'acc3', name: '@business_account', followers: '1.2K followers', platform: 'Instagram' }
  ]

  const mockPosts = [
    { 
      id: 'post1', 
      title: 'New Product Launch', 
      type: 'post', 
      engagement: '124 likes, 23 comments',
      thumbnail: '/api/placeholder/80/80'
    },
    { 
      id: 'post2', 
      title: 'Behind the Scenes', 
      type: 'reel', 
      engagement: '89 likes, 12 comments',
      thumbnail: '/api/placeholder/80/80'
    },
    { 
      id: 'post3', 
      title: 'Team Update', 
      type: 'story', 
      engagement: '45 views',
      thumbnail: '/api/placeholder/80/80'
    }
  ]

  const tabs = [
    { id: 'setup', name: 'Setup', icon: <Settings className="w-4 h-4" /> },
    { id: 'targeting', name: 'Targeting', icon: <Target className="w-4 h-4" /> },
    { id: 'timing', name: 'Timing', icon: <Clock className="w-4 h-4" /> },
    { id: 'ai', name: 'AI Settings', icon: <Brain className="w-4 h-4" /> },
    { id: 'safety', name: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'integrations', name: 'Integrations', icon: <Globe className="w-4 h-4" /> }
  ]

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    const formData = {
      selectedPlatform,
      selectedAccount,
      selectedPost,
      automationType,
      isActive,
      keywords,
      commentReply,
      dmMessage,
      autoFollowEnabled,
      followTargetAccounts,
      followersPerDay,
      autoLikeEnabled,
      likeTargetHashtags,
      likesPerHour,
      storyAutoReply,
      storyKeywords,
      storyReplyMessage,
      aiPersonality,
      maxRepliesPerDay,
      cooldownPeriod,
      activeHours,
      activeDays,
      timezone,
      trackEngagement,
      trackFollowerGrowth,
      trackConversions
    }
    
    console.log('Advanced automation setup...', formData)
  }

  const renderSetupTab = () => (
    <div className="space-y-4">
      {/* Platform Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Platform & Account
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPlatform === platform.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {platform.icon}
                <span className="font-medium">{platform.name}</span>
              </div>
            </button>
          ))}
        </div>
        
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">Select Account</option>
          {mockAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} - {account.followers}
            </option>
          ))}
        </select>
      </div>

      {/* Automation Type */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Automation Type
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {automationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setAutomationType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                automationType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {type.icon}
                <span className="font-medium">{type.name}</span>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Keywords & Triggers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Keywords & Triggers
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              id="newKeyword"
              name="newKeyword"
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <button
              onClick={addKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Response Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Response Messages
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment Reply
            </label>
            <textarea
              id="commentReply"
              name="commentReply"
              value={commentReply}
              onChange={(e) => setCommentReply(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows="2"
              placeholder="Public reply to comments..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DM Message
            </label>
            <textarea
              id="dmMessage"
              name="dmMessage"
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows="3"
              placeholder="Private message to send..."
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderTargetingTab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Audience Targeting
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                id="targetFollowers"
                name="targetFollowers"
                type="checkbox"
                checked={targetFollowers}
                onChange={(e) => setTargetFollowers(e.target.checked)}
                className="rounded"
              />
              <span>Target Followers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="targetNonFollowers"
                name="targetNonFollowers"
                type="checkbox"
                checked={targetNonFollowers}
                onChange={(e) => setTargetNonFollowers(e.target.checked)}
                className="rounded"
              />
              <span>Target Non-Followers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="targetVerified"
                name="targetVerified"
                type="checkbox"
                checked={targetVerified}
                onChange={(e) => setTargetVerified(e.target.checked)}
                className="rounded"
              />
              <span>Verified Accounts Only</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="targetBusinessAccounts"
                name="targetBusinessAccounts"
                type="checkbox"
                checked={targetBusinessAccounts}
                onChange={(e) => setTargetBusinessAccounts(e.target.checked)}
                className="rounded"
              />
              <span>Business Accounts</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Followers
              </label>
              <input
                id="minFollowersTarget"
                name="minFollowersTarget"
                type="number"
                value={minFollowersTarget}
                onChange={(e) => setMinFollowersTarget(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Followers
              </label>
              <input
                id="maxFollowersTarget"
                name="maxFollowersTarget"
                type="number"
                value={maxFollowersTarget}
                onChange={(e) => setMaxFollowersTarget(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Auto-Follow Settings
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              id="autoFollowEnabled"
              name="autoFollowEnabled"
              type="checkbox"
              checked={autoFollowEnabled}
              onChange={(e) => setAutoFollowEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Auto-Follow</span>
          </label>
          
          {autoFollowEnabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follows per Day
                  </label>
                  <input
                    id="followersPerDay"
                    name="followersPerDay"
                    type="number"
                    value={followersPerDay}
                    onChange={(e) => setFollowersPerDay(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unfollow After (days)
                  </label>
                  <input
                    id="unfollowAfterDays"
                    name="unfollowAfterDays"
                    type="number"
                    value={unfollowAfterDays}
                    onChange={(e) => setUnfollowAfterDays(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Accounts (comma-separated)
                </label>
                <input
                  type="text"
                  value={followTargetAccounts.join(', ')}
                  onChange={(e) => setFollowTargetAccounts(e.target.value.split(', '))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="@account1, @account2, @account3"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Auto-Like Settings
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoLikeEnabled}
              onChange={(e) => setAutoLikeEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Auto-Like</span>
          </label>
          
          {autoLikeEnabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Likes per Hour
                  </label>
                  <input
                    type="number"
                    value={likesPerHour}
                    onChange={(e) => setLikesPerHour(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Likes per Day
                  </label>
                  <input
                    type="number"
                    value={maxLikesPerDay}
                    onChange={(e) => setMaxLikesPerDay(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Hashtags (comma-separated)
                </label>
                <input
                  type="text"
                  value={likeTargetHashtags.join(', ')}
                  onChange={(e) => setLikeTargetHashtags(e.target.value.split(', '))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="#hashtag1, #hashtag2, #hashtag3"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderTimingTab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Active Hours
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={scheduleActive}
              onChange={(e) => setScheduleActive(e.target.checked)}
              className="rounded"
            />
            <span>Enable Schedule</span>
          </label>
          
          {scheduleActive && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={activeHours.start}
                    onChange={(e) => setActiveHours({...activeHours, start: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={activeHours.end}
                    onChange={(e) => setActiveHours({...activeHours, end: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Days
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveDays([...activeDays, day])
                          } else {
                            setActiveDays(activeDays.filter(d => d !== day))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Timer className="w-4 h-4" />
          Rate Limits
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Replies/Day
            </label>
            <input
              id="maxRepliesPerDay"
              name="maxRepliesPerDay"
              type="number"
              value={maxRepliesPerDay}
              onChange={(e) => setMaxRepliesPerDay(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooldown (minutes)
            </label>
            <input
              id="cooldownPeriod"
              name="cooldownPeriod"
              type="number"
              value={cooldownPeriod}
              onChange={(e) => setCooldownPeriod(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAITab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Personality
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personality Type
            </label>
            <select
              id="aiPersonality"
              name="aiPersonality"
              value={aiPersonality}
              onChange={(e) => setAiPersonality(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="witty">Witty</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                id="useAiPersonalization"
                name="useAiPersonalization"
                type="checkbox"
                checked={useAiPersonalization}
                onChange={(e) => setUseAiPersonalization(e.target.checked)}
                className="rounded"
              />
              <span>AI Personalization</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                id="aiLearningEnabled"
                name="aiLearningEnabled"
                type="checkbox"
                checked={aiLearningEnabled}
                onChange={(e) => setAiLearningEnabled(e.target.checked)}
                className="rounded"
              />
              <span>AI Learning</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aiContextAwareness}
                onChange={(e) => setAiContextAwareness(e.target.checked)}
                className="rounded"
              />
              <span>Context Awareness</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aiSentimentAnalysis}
                onChange={(e) => setAiSentimentAnalysis(e.target.checked)}
                className="rounded"
              />
              <span>Sentiment Analysis</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response Variations
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={responseVariations}
              onChange={(e) => setResponseVariations(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>{responseVariations}</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSafetyTab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Account Safety
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Safety Level
            </label>
            <select
              value={accountSafety}
              onChange={(e) => setAccountSafety(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="high">High (Safest)</option>
              <option value="medium">Medium</option>
              <option value="low">Low (Aggressive)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={respectRateLimits}
                onChange={(e) => setRespectRateLimits(e.target.checked)}
                className="rounded"
              />
              <span>Respect Rate Limits</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={humanizedDelays}
                onChange={(e) => setHumanizedDelays(e.target.checked)}
                className="rounded"
              />
              <span>Humanized Delays</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Analytics & Reporting
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={trackEngagement}
                onChange={(e) => setTrackEngagement(e.target.checked)}
                className="rounded"
              />
              <span>Track Engagement</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={trackFollowerGrowth}
                onChange={(e) => setTrackFollowerGrowth(e.target.checked)}
                className="rounded"
              />
              <span>Follower Growth</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={trackConversions}
                onChange={(e) => setTrackConversions(e.target.checked)}
                className="rounded"
              />
              <span>Track Conversions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={performanceGoals}
                onChange={(e) => setPerformanceGoals(e.target.checked)}
                className="rounded"
              />
              <span>Performance Goals</span>
            </label>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dailyReports}
                onChange={(e) => setDailyReports(e.target.checked)}
                className="rounded"
              />
              <span>Daily Reports</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={weeklyReports}
                onChange={(e) => setWeeklyReports(e.target.checked)}
                className="rounded"
              />
              <span>Weekly Reports</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={realTimeAlerts}
                onChange={(e) => setRealTimeAlerts(e.target.checked)}
                className="rounded"
              />
              <span>Real-time Alerts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationsTab = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          External Integrations
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={webhookEnabled}
                onChange={(e) => setWebhookEnabled(e.target.checked)}
                className="rounded"
              />
              <span>Webhook Integration</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={slackIntegration}
                onChange={(e) => setSlackIntegration(e.target.checked)}
                className="rounded"
              />
              <span>Slack Integration</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={discordIntegration}
                onChange={(e) => setDiscordIntegration(e.target.checked)}
                className="rounded"
              />
              <span>Discord Integration</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded"
              />
              <span>Email Notifications</span>
            </label>
          </div>
          
          {webhookEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="https://your-webhook-url.com"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return renderSetupTab()
      case 'targeting':
        return renderTargetingTab()
      case 'timing':
        return renderTimingTab()
      case 'ai':
        return renderAITab()
      case 'safety':
        return renderSafetyTab()
      case 'analytics':
        return renderAnalyticsTab()
      case 'integrations':
        return renderIntegrationsTab()
      default:
        return renderSetupTab()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Automation Setup</h1>
          <p className="text-gray-600">Configure comprehensive automation for your social media accounts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="font-medium">
                    Automation Status: {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex w-12 h-6 items-center rounded-full transition-colors ${
                    isActive ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${
                      isActive ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon}
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {renderTabContent()}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Automation Setup
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </h3>
              
              {/* Instagram Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">@{selectedAccount || 'your_account'}</p>
                    <p className="text-xs text-gray-500">Automation Active</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                    <span className="text-sm font-medium">user_comment</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{previewComment}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>2m</span>
                    <button className="text-blue-600">Reply</button>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">@{selectedAccount || 'your_account'}</span>
                  </div>
                  <p className="text-sm text-gray-700">{commentReply}</p>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">DM Preview</span>
                  </div>
                  <p className="text-sm text-gray-600">{dmMessage}</p>
                </div>
              </div>
              
              {/* Automation Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Keywords</span>
                  <span className="text-sm font-medium">{keywords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max Replies/Day</span>
                  <span className="text-sm font-medium">{maxRepliesPerDay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Personality</span>
                  <span className="text-sm font-medium capitalize">{aiPersonality}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Automation Type</span>
                  <span className="text-sm font-medium">
                    {automationTypes.find(t => t.id === automationType)?.name || 'Comment → DM'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}