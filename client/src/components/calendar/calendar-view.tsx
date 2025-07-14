import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Share2, 
  Filter, 
  Grid3X3, 
  Calendar, 
  List,
  Clock,
  Star,
  TrendingUp,
  Users,
  Heart,
  Gift,
  Globe,
  Zap,
  Target,
  Award
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Real social media events mapped to actual dates in 2025
const realSocialEvents = {
  // January 2025
  '2025-01-01': { title: 'New Year\'s Day', icon: '🎉', hashtags: ['#NewYear', '#2025', '#NewBeginnings'], engagement: 'Very High', category: 'Holiday' },
  '2025-01-04': { title: 'World Braille Day', icon: '👁️', hashtags: ['#WorldBrailleDay', '#Accessibility', '#Inclusion'], engagement: 'Medium', category: 'Awareness' },
  '2025-01-20': { title: 'Martin Luther King Jr. Day', icon: '✊', hashtags: ['#MLKDay', '#CivilRights', '#Equality'], engagement: 'High', category: 'Social Impact' },
  
  // February 2025
  '2025-02-04': { title: 'World Cancer Day', icon: '🎗️', hashtags: ['#WorldCancerDay', '#CancerAwareness', '#Hope'], engagement: 'High', category: 'Health' },
  '2025-02-14': { title: 'Valentine\'s Day', icon: '💕', hashtags: ['#ValentinesDay', '#Love', '#Romance'], engagement: 'Very High', category: 'Holiday' },
  '2025-02-20': { title: 'World Day of Social Justice', icon: '⚖️', hashtags: ['#SocialJustice', '#Equality', '#HumanRights'], engagement: 'Medium', category: 'Social Impact' },
  
  // March 2025
  '2025-03-08': { title: 'International Women\'s Day', icon: '👩', hashtags: ['#IWD2025', '#WomensDay', '#GenderEquality'], engagement: 'Very High', category: 'Social Impact' },
  '2025-03-17': { title: 'St. Patrick\'s Day', icon: '🍀', hashtags: ['#StPatricksDay', '#LuckOfTheIrish', '#Green'], engagement: 'High', category: 'Holiday' },
  '2025-03-21': { title: 'World Poetry Day', icon: '📝', hashtags: ['#WorldPoetryDay', '#Poetry', '#Literature'], engagement: 'Medium', category: 'Culture' },
  
  // April 2025
  '2025-04-07': { title: 'World Health Day', icon: '🏥', hashtags: ['#WorldHealthDay', '#Health', '#Wellness'], engagement: 'High', category: 'Health' },
  '2025-04-22': { title: 'Earth Day', icon: '🌍', hashtags: ['#EarthDay', '#ClimateAction', '#Sustainability'], engagement: 'Very High', category: 'Environment' },
  
  // May 2025
  '2025-05-01': { title: 'International Workers\' Day', icon: '👷', hashtags: ['#MayDay', '#WorkersRights', '#Labor'], engagement: 'High', category: 'Social Impact' },
  '2025-05-11': { title: 'Mother\'s Day', icon: '👩‍👧‍👦', hashtags: ['#MothersDay', '#Mom', '#Family'], engagement: 'Very High', category: 'Holiday' },
  
  // June 2025
  '2025-06-05': { title: 'World Environment Day', icon: '🌱', hashtags: ['#WorldEnvironmentDay', '#ClimateChange', '#GreenLiving'], engagement: 'High', category: 'Environment' },
  '2025-06-15': { title: 'Father\'s Day', icon: '👨‍👧‍👦', hashtags: ['#FathersDay', '#Dad', '#Family'], engagement: 'Very High', category: 'Holiday' },
  
  // July 2025
  '2025-07-14': { title: 'National Mac and Cheese Day', icon: '🧀', hashtags: ['#MacNCheeseDay', '#ComfortFood', '#Foodie'], engagement: 'High', category: 'Food & Lifestyle' },
  '2025-07-15': { title: 'Social Media Giving Day', icon: '💝', hashtags: ['#GivingTuesday', '#SocialGood', '#Charity'], engagement: 'Very High', category: 'Social Impact' },
  '2025-07-17': { title: 'World Emoji Day', icon: '😊', hashtags: ['#WorldEmojiDay', '#Emojis', '#DigitalCommunication'], engagement: 'High', category: 'Digital Culture' },
  '2025-07-18': { title: 'Nelson Mandela International Day', icon: '🕊️', hashtags: ['#MandelaDay', '#Peace', '#Leadership'], engagement: 'Very High', category: 'Social Impact' },
  '2025-07-20': { title: 'International Chess Day', icon: '♟️', hashtags: ['#ChessDay', '#Strategy', '#MindGames'], engagement: 'Medium', category: 'Sports & Games' },
  
  // August 2025
  '2025-08-19': { title: 'World Photography Day', icon: '📸', hashtags: ['#WorldPhotographyDay', '#Photography', '#Visual'], engagement: 'High', category: 'Arts & Culture' },
  
  // September 2025
  '2025-09-21': { title: 'International Day of Peace', icon: '🕊️', hashtags: ['#PeaceDay', '#WorldPeace', '#Unity'], engagement: 'High', category: 'Social Impact' },
  
  // October 2025
  '2025-10-10': { title: 'World Mental Health Day', icon: '🧠', hashtags: ['#WorldMentalHealthDay', '#MentalHealth', '#Wellness'], engagement: 'Very High', category: 'Health' },
  '2025-10-31': { title: 'Halloween', icon: '🎃', hashtags: ['#Halloween', '#SpookySeason', '#TrickOrTreat'], engagement: 'Very High', category: 'Holiday' },
  
  // November 2025
  '2025-11-25': { title: 'Giving Tuesday', icon: '🤝', hashtags: ['#GivingTuesday', '#Charity', '#Generosity'], engagement: 'Very High', category: 'Social Impact' },
  '2025-11-27': { title: 'Thanksgiving', icon: '🦃', hashtags: ['#Thanksgiving', '#Gratitude', '#Family'], engagement: 'Very High', category: 'Holiday' },
  
  // December 2025
  '2025-12-01': { title: 'World AIDS Day', icon: '🎗️', hashtags: ['#WorldAIDSDay', '#HIVAwareness', '#RedRibbon'], engagement: 'High', category: 'Health' },
  '2025-12-25': { title: 'Christmas Day', icon: '🎄', hashtags: ['#Christmas', '#Holiday', '#Joy'], engagement: 'Very High', category: 'Holiday' },
  '2025-12-31': { title: 'New Year\'s Eve', icon: '🎊', hashtags: ['#NYE', '#NewYear', '#Celebration'], engagement: 'Very High', category: 'Holiday' }
}

const socialEvents = [
  { 
    day: 'Mon', 
    title: 'National Mac n Cheese Day', 
    color: 'bg-gradient-to-r from-orange-500 to-yellow-500',
    icon: '🧀',
    hashtags: ['#MacNCheeseDay', '#ComfortFood', '#Foodie'],
    engagement: 'High',
    category: 'Food & Lifestyle'
  },
  { 
    day: 'Tue', 
    title: 'Social Media Giving Day', 
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    icon: '💝',
    hashtags: ['#GivingTuesday', '#SocialGood', '#Charity'],
    engagement: 'Very High',
    category: 'Social Impact'
  },
  { 
    day: 'Wed',
    title: 'World Emoji Day',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    icon: '😊',
    hashtags: ['#WorldEmojiDay', '#Emojis', '#Expression'],
    engagement: 'High',
    category: 'Digital Culture'
  },
  { 
    day: 'Thu', 
    title: 'World Day for International Justice', 
    color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    icon: '⚖️',
    hashtags: ['#InternationalJustice', '#HumanRights', '#Justice'],
    engagement: 'Medium',
    category: 'Social Awareness'
  },
  { 
    day: 'Fri', 
    title: 'Nelson Mandela International Day', 
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    icon: '🕊️',
    hashtags: ['#MandelaDay', '#Peace', '#Leadership', '#Inspiration'],
    engagement: 'Very High',
    category: 'Social Impact'
  },
  {
    day: 'Sat',
    title: 'International Chess Day',
    color: 'bg-gradient-to-r from-gray-600 to-gray-800',
    icon: '♟️',
    hashtags: ['#ChessDay', '#Strategy', '#MindGames'],
    engagement: 'Medium',
    category: 'Sports & Games'
  }
]

const recommendedTimes = [
  { 
    day: 'Sun', 
    time: '7:30 PM', 
    reason: 'Peak evening engagement',
    score: '92%',
    audience: '2.1K active followers'
  },
  { 
    day: 'Mon', 
    time: '12:00 PM', 
    reason: 'Lunch break peak',
    score: '85%',
    audience: '1.8K active followers'
  },
  { 
    day: 'Tue', 
    time: '3:00 PM', 
    reason: 'Afternoon engagement spike',
    score: '88%',
    audience: '2.0K active followers'
  },
  { 
    day: 'Wed', 
    time: '11:00 AM', 
    reason: 'Mid-morning peak',
    score: '82%',
    audience: '1.6K active followers'
  },
  { 
    day: 'Thu', 
    time: '2:00 PM', 
    reason: 'Workday break time',
    score: '90%',
    audience: '2.2K active followers'
  },
  { 
    day: 'Fri', 
    time: '6:00 PM', 
    reason: 'Weekend anticipation peak',
    score: '95%',
    audience: '2.5K active followers'
  },
  { 
    day: 'Sat', 
    time: '11:00 AM', 
    reason: 'Weekend leisure browsing',
    score: '87%',
    audience: '1.9K active followers'
  }
]

export function CalendarView() {
  const [selectedView, setSelectedView] = useState('grid')
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Generate real dates for current week
  const weekData = useMemo(() => {
    const startOfWeek = new Date(currentWeekStart)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day) // Move to Sunday

    const dates = []
    const formattedDates = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
      formattedDates.push(date.getDate().toString())
    }

    const weekRange = `${monthNames[dates[0].getMonth()]} ${dates[0].getDate()} - ${dates[6].getDate()}, ${dates[0].getFullYear()}`
    
    return { dates, formattedDates, weekRange }
  }, [currentWeekStart])

  // Get real social media event for a specific date
  const getEventForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0] // Format: YYYY-MM-DD
    return realSocialEvents[dateKey]
  }

  // Fixed scheduled posts with specific real dates
  const scheduledPosts = [
    // Published posts (past dates)
    {
      id: 1,
      date: new Date('2025-07-13T00:20:00'), // July 13, 2025 12:20 AM
      username: 'rahulc1020',
      handle: '@barry #lifestyle',
      time: '12:20AM',
      image: '/api/placeholder/80/80',
      status: 'published',
      platform: 'instagram'
    },
    {
      id: 2,
      date: new Date('2025-07-13T01:35:00'), // July 13, 2025 1:35 AM
      username: 'rahulc1020',
      handle: '@barry #my',
      time: '1:35AM',
      image: '/api/placeholder/80/80',
      status: 'published',
      platform: 'instagram'
    },
    // Scheduled posts (future dates)
    {
      id: 3,
      date: new Date('2025-07-14T09:00:00'), // July 14, 2025 9:00 AM
      username: 'rahulc1020',
      handle: '@work #motivation',
      time: '9:00AM',
      image: '/api/placeholder/80/80',
      status: 'scheduled',
      platform: 'instagram'
    },
    {
      id: 4,
      date: new Date('2025-07-16T14:30:00'), // July 16, 2025 2:30 PM
      username: 'rahulc1020',
      handle: '@midweek #energy',
      time: '2:30PM',
      image: '/api/placeholder/80/80',
      status: 'scheduled',
      platform: 'instagram'
    },
    {
      id: 5,
      date: new Date('2025-07-16T18:45:00'), // July 16, 2025 6:45 PM
      username: 'rahulc1020',
      handle: '@wellness #tips',
      time: '6:45PM',
      image: '/api/placeholder/80/80',
      status: 'draft',
      platform: 'instagram'
    },
    {
      id: 6,
      date: new Date('2025-07-18T17:00:00'), // July 18, 2025 5:00 PM
      username: 'rahulc1020',
      handle: '@friday #vibes',
      time: '5:00PM',
      image: '/api/placeholder/80/80',
      status: 'scheduled',
      platform: 'instagram'
    },
    // Additional posts for other weeks/months
    {
      id: 7,
      date: new Date('2025-07-21T10:00:00'), // July 21, 2025 10:00 AM
      username: 'rahulc1020',
      handle: '@monday #motivation',
      time: '10:00AM',
      image: '/api/placeholder/80/80',
      status: 'scheduled',
      platform: 'instagram'
    },
    {
      id: 8,
      date: new Date('2025-08-01T12:00:00'), // August 1, 2025 12:00 PM
      username: 'rahulc1020',
      handle: '@august #newmonth',
      time: '12:00PM',
      image: '/api/placeholder/80/80',
      status: 'scheduled',
      platform: 'instagram'
    }
  ]

  const getPostsForDate = (date: Date) => scheduledPosts.filter(post => 
    post.date.toDateString() === date.toDateString()
  )

  // Generate recommended times for current week
  const getRecommendedTimeForDay = (dayIndex: number) => {
    const times = ['10:00 AM', '2:00 PM', '6:00 PM', '8:30 PM', '11:00 AM', '4:00 PM', '7:00 PM']
    const reasons = ['Peak engagement', 'Lunch break scroll', 'Evening active', 'Prime time', 'Morning coffee', 'Afternoon break', 'Weekend vibes']
    
    if (dayIndex < times.length) {
      return {
        time: times[dayIndex],
        reason: reasons[dayIndex],
        score: `${85 + dayIndex}%`
      }
    }
    return null
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newDate)
  }

  return (
    <div className="w-full h-full">
      {/* Full Width Calendar Container */}
      <div className="bg-white min-h-screen">
        {/* Simple Calendar Header matching reference */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg">Today</span>
              <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-gray-600">{weekData.weekRange}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              Filters
              <Filter className="w-4 h-4 ml-2" />
            </Button>
            <div className="flex border rounded-md">
              <Button variant="ghost" size="sm">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="bg-gray-100">
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Full Width Calendar Grid */}
        <div className="w-full">
          {/* Calendar Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-7">
              {weekDays.map((day, index) => {
                const currentDate = weekData.dates[index]
                const isToday = currentDate.toDateString() === new Date().toDateString()
                
                return (
                  <div key={day} className="text-center p-4 border-r border-gray-200 last:border-r-0">
                    <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                      isToday ? 'bg-slate-700 text-white' : 'text-gray-900'
                    }`}>
                      {weekData.formattedDates[index]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Calendar Body */}
          <div className="grid grid-cols-7 min-h-[600px]">
            {weekData.dates.map((date, index) => {
              const event = getEventForDate(date)
              const recommendedTime = getRecommendedTimeForDay(index)
              const posts = getPostsForDate(date)
              
              return (
                <div key={index} className={`p-4 space-y-3 min-h-[600px] bg-white ${index < 6 ? 'border-r border-gray-200' : ''}`}>
                  
                  {/* Real Social Events - Compact blue badges */}
                  {event && (
                    <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md font-medium flex items-center space-x-1">
                      <span>{event.icon}</span>
                      <span className="truncate">{event.title}</span>
                    </div>
                  )}

                  {/* Scheduled Posts - Cards with thumbnails matching reference */}
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {/* Post image */}
                      <div className="relative">
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute bottom-2 left-2">
                          <Avatar className="w-6 h-6 border-2 border-white">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback className="text-xs bg-pink-500 text-white">R</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      
                      {/* Post details */}
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-900 mb-1">{post.username}</div>
                        <div className="text-xs text-gray-500 mb-1">{post.handle}</div>
                        <div className="text-xs text-gray-500 mb-2">{post.time}</div>
                        
                        <div className="flex items-center space-x-1">
                          {post.status === 'published' && (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Published</span>
                            </>
                          )}
                          {post.status === 'scheduled' && (
                            <>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-blue-600 font-medium">Scheduled</span>
                            </>
                          )}
                          {post.status === 'draft' && (
                            <>
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <span className="text-xs text-gray-600 font-medium">Draft</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Recommended Times - Simple purple cards */}
                  {recommendedTime && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-xs text-purple-600 font-medium mb-1">Recommended time</div>
                      <div className="text-sm font-bold text-purple-700">{recommendedTime.time}</div>
                      <div className="text-xs text-gray-500">{recommendedTime.reason}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}