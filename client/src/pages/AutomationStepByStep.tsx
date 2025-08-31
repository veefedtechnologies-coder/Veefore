import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Eye,
  Hash,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  UserPlus,
  Share2,
  PlayCircle,
  Target,
  Clock,
  Brain,
  Shield,
  BarChart3,
  Globe,
  FileText,
  MessageSquare,
  Settings,
  ChevronDown,
  Search,
  Check,
  Play,
  Pause,
  Trash2,
  Reply
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { useCurrentWorkspace } from '@/components/WorkspaceSwitcher'
import { useAuth } from '@/hooks/useAuth'

// AutomationListManager component
const AutomationListManager = ({ 
  automationRules, 
  rulesLoading, 
  updateAutomationMutation, 
  deleteAutomationMutation 
}: {
  automationRules: any[]
  rulesLoading: boolean
  updateAutomationMutation: any
  deleteAutomationMutation: any
}) => {
  const { toast } = useToast()

  const handleToggleActive = async (ruleId: string, isActive: boolean) => {
    try {
      await updateAutomationMutation.mutateAsync({
        ruleId,
        updates: { isActive: !isActive }
      })
    } catch (error) {
      console.error('Error toggling automation:', error)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      try {
        await deleteAutomationMutation.mutateAsync(ruleId)
      } catch (error) {
        console.error('Error deleting automation:', error)
      }
    }
  }

  if (rulesLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Automation Rules</h2>
        <p className="text-gray-600">Manage your active automation rules</p>
      </div>

      {automationRules?.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules yet</h3>
          <p className="text-gray-600 mb-4">Create your first automation rule to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {automationRules?.map((rule) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Bot className={`w-5 h-5 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{rule.type} automation</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Keywords:</span>
                      <div className="mt-1">
                        {rule.keywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.keywords.slice(0, 3).map((keyword: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                            {rule.keywords.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{rule.keywords.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No keywords</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Target Posts:</span>
                      <p className="text-sm text-gray-900">{rule.targetMediaIds?.length || 0} posts</p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Responses:</span>
                      <p className="text-sm text-gray-900">{rule.responses?.length || 0} comment + {rule.dmResponses?.length || 0} DM</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created: {new Date(rule.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(rule.id, rule.isActive)}
                    disabled={updateAutomationMutation.isPending}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={rule.isActive ? 'Pause automation' : 'Resume automation'}
                  >
                    {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(rule.id)}
                    disabled={deleteAutomationMutation.isPending}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete automation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Add this component after the existing components but before the main AutomationStepByStep component
// Define interfaces for comment structure
interface CommentReply {
  id: number;
  username: string;
  profilePic: string;
  timestamp: string;
  content: string;
  likes: number;
}

interface Comment {
  id: number;
  username: string;
  profilePic: string;
  timestamp: string;
  isAuthor: boolean;
  content: string;
  likes: number;
  replies: CommentReply[];
}

const CommentScreen = ({ isVisible, onClose, triggerKeywords, automationType, commentReplies, dmMessage, selectedAccount, realAccounts, newKeyword, commentInputText, setCommentInputText, getCurrentKeywords, getCurrentKeywordsSetter, setSelectedKeywords, updateSourceRef, currentTime }: {
  isVisible: boolean;
  onClose: () => void;
  triggerKeywords: string[]
  automationType: string
  commentReplies: string[]
  dmMessage: string
  selectedAccount: string
  realAccounts: any[]
  newKeyword: string
  commentInputText: string
  setCommentInputText: (text: string) => void
  getCurrentKeywords: () => string[]
  getCurrentKeywordsSetter: () => React.Dispatch<React.SetStateAction<string[]>>
  setSelectedKeywords: (keywords: string[]) => void
  updateSourceRef: React.MutableRefObject<'trigger' | 'comment' | null>
  currentTime: Date
}) => {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();

  // Custom CSS to completely remove focus styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .comment-input-no-focus:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
        border-width: 0 !important;
        border-style: none !important;
        border-color: transparent !important;
      }
      .comment-input-no-focus:focus-visible {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Bidirectional synchronization between newKeyword and commentText
  useEffect(() => {
    // Only sync from newKeyword to commentText when newKeyword changes from external source
    if (newKeyword !== commentText && newKeyword !== commentInputText) {
      setCommentText(newKeyword);
      setCommentInputText(newKeyword);
    }
  }, [newKeyword]);

  // Synchronize commentText changes back to parent component only when user types in comment input
  useEffect(() => {
    if (commentText !== commentInputText) {
      // Set the source to indicate this update came from the comment input
      updateSourceRef.current = 'comment';
      setCommentInputText(commentText);
      // Reset the source after a short delay
      setTimeout(() => updateSourceRef.current = null, 100);
    }
  }, [commentText]);

  // Generate realistic timestamps
  const generateTimestamp = () => {
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 24) + 1;
    const timeAgo = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    if (hoursAgo === 1) return '1h';
    if (hoursAgo < 24) return `${hoursAgo}h`;
    
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo === 1) return '1d';
    return `${daysAgo}d`;
  };
  
  // Function to fetch real Instagram user data
  const fetchRealInstagramUser = async () => {
    try {
      // Get the current workspace ID from the selected account
      const selectedAccountData = realAccounts.find((a: any) => a.id === selectedAccount);
      const workspaceId = selectedAccountData?.workspaceId;
      
      if (!workspaceId) {
        console.warn('No workspace ID found, using fallback data');
        return {
          username: 'rahulc1020',
          profilePic: 'https://picsum.photos/40/40?random=rahulc1020'
        };
      }

      // Fetch real Instagram user data from the API
      try {
        // Get the user's authentication token
        if (!user) {
          console.error('No authenticated user found');
          throw new Error('User not authenticated');
        }
        
        const token = await user.getIdToken();
        
        const response = await fetch(`/api/instagram/user-profile?workspaceId=${workspaceId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          mode: 'cors'
        });
        
        if (response.ok) {
          const userData = await response.json();
          
          const result = {
            username: userData.username || 'rahulc1020',
            profilePic: userData.profile_picture_url || 'https://picsum.photos/40/40?random=rahulc1020'
          };
          return result;
        } else {
          const errorText = await response.text();
          console.error('API response not ok:', errorText);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Failed to fetch Instagram user data:', error);
    }
    
    // Fallback to default data if API fails
    return {
      username: 'rahulc1020',
      profilePic: 'https://picsum.photos/40/40?random=rahulc1020'
    };
  };

  // State for real Instagram user data
  const [realInstagramUser, setRealInstagramUser] = useState({
    username: 'rahulc1020',
    profilePic: 'https://picsum.photos/40/40?random=rahulc1020'
  });

  // Fetch real Instagram user data when component mounts or dependencies change
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchRealInstagramUser();
      setRealInstagramUser(userData);
    };
    
    if (selectedAccount && realAccounts.length > 0) {
      fetchUser();
    }
  }, [user, selectedAccount, realAccounts]); // Dependencies for re-fetching

  const [commentTimestamps, setCommentTimestamps] = useState<{ [key: string]: { main: Date; reply: Date } }>({});

  // Generate timestamps for new keywords only when they're added
  useEffect(() => {
    const newTimestamps: { [key: string]: { main: Date; reply: Date } } = {};
    
    triggerKeywords.forEach((keyword, index) => {
      if (!commentTimestamps[keyword]) {
        const now = new Date();
        let mainCommentTime: Date;
        let replyTime: Date;
        
        if (index === 0) {
          // First keyword: very recent (just now or few seconds ago)
          mainCommentTime = new Date(now.getTime() - (Math.random() * 30 + 5) * 1000); // 5-35 seconds ago
          replyTime = new Date(now.getTime() - (Math.random() * 20 + 2) * 1000); // 2-22 seconds ago
        } else if (index === 1) {
          // Second keyword: few minutes ago
          mainCommentTime = new Date(now.getTime() - (Math.random() * 10 + 1) * 60 * 1000); // 1-11 minutes ago
          replyTime = new Date(now.getTime() - (Math.random() * 5 + 1) * 60 * 1000); // 1-6 minutes ago
        } else if (index === 2) {
          // Third keyword: few minutes ago
          mainCommentTime = new Date(now.getTime() - (Math.random() * 15 + 2) * 60 * 1000); // 2-17 minutes ago
          replyTime = new Date(now.getTime() - (Math.random() * 10 + 1) * 60 * 1000); // 1-11 minutes ago
        } else {
          // Other keywords: still recent, under 30 minutes
          mainCommentTime = new Date(now.getTime() - (Math.random() * 20 + 5) * 60 * 1000); // 5-25 minutes ago
          replyTime = new Date(now.getTime() - (Math.random() * 15 + 2) * 60 * 1000); // 2-17 minutes ago
        }
        
        newTimestamps[keyword] = { main: mainCommentTime, reply: replyTime };
      }
    });
    
    if (Object.keys(newTimestamps).length > 0) {
      setCommentTimestamps(prev => ({ ...prev, ...newTimestamps }));
    }
  }, [triggerKeywords, commentTimestamps]);

  // Function to calculate relative time like Instagram with reduced fluctuation
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      if (diffInSeconds < 10) return 'just now';
      // Round to nearest 5 seconds for recent timestamps to reduce fluctuation
      const roundedSeconds = Math.floor(diffInSeconds / 5) * 5;
      return `${roundedSeconds}s`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      // Round to nearest minute for recent timestamps
      if (diffInMinutes < 5) return `${diffInMinutes}m`;
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y`;
  };

  // Generate test comments with stable timestamps
  const testComments = useMemo(() => {
    if (triggerKeywords.length === 0) {
      return [{
        id: 1,
        username: 'Username',
        profilePic: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGNUY1RjUiIHN0cm9rZT0iI0Q5RDlEOSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNC41IiBmaWxsPSIjOUNBNEFCIi8+CjxwYXRoIGQ9Ik0yOCAyN0MyOCAyNC4yNjk3IDI0LjQxODMgMjIgMjAgMjJDMTUuNTgxNyAyMiAxMiAyNC4yNjk3IDEyIDI3SDI4WiIgZmlsbD0iIzlDQTRBQiIvPgo8L3N2Zz4K',
        content: 'Please add trigger keywords to see how the automation will work.',
        timestamp: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
        likes: 0,
        replies: []
      }];
    }

    return triggerKeywords.map((keyword, index) => {
      // Use stable timestamps from commentTimestamps state
      const timestamps = commentTimestamps[keyword];
      const mainCommentTime = timestamps?.main || new Date();
      const replyTime = timestamps?.reply || new Date();
      
      return {
        id: index + 1,
        username: `Username_${index + 1}`,
        profilePic: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNC41IiBmaWxsPSIjOUNBNEFCIi8+CjxwYXRoIGQ9Ik0yOCAyN0MyOCAyNC4yNjk3IDI0LjQxODMgMjIgMjAgMjJDMTUuNTgxNyAyMiAxMiAyNC4yNjk3IDEyIDI3SDI4WiIgZmlsbD0iIzlDQTRBQiIvPgo8L3N2Zz4K',
        content: keyword,
        timestamp: mainCommentTime,
        likes: 0,
        replies: [
          {
            id: index + 1,
            username: realInstagramUser.username,
            profilePic: realInstagramUser.profilePic,
            content: commentReplies[index % commentReplies.length] || 'Message sent!',
            timestamp: replyTime,
            likes: 0
          }
        ]
      };
    });
  }, [triggerKeywords, commentTimestamps, realInstagramUser]);

  return (
    <div 
      className={`absolute inset-0 bg-black/50 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`absolute left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          height: '70%',
          bottom: '0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">Comments</h3>
            <button 
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {testComments.map((comment) => (
            <div key={comment.id} className="mb-6 pb-0">
              {/* Main Comment */}
              <div className="flex gap-3">
                {/* Profile Picture - Left side */}
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 flex items-start">
                  <img 
                    src={comment.profilePic} 
                    alt={comment.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Comment Content Block - Right side */}
                <div className="flex-1 min-w-0">
                  {/* Username, Timestamp, Comment Text, and Like Button */}
                  <div className="flex items-start justify-between mb-3">
                    {/* Left side - Username, Timestamp, and Comment Text */}
                    <div className="flex-1 min-w-0">
                      {/* Username and Timestamp on first line */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 leading-none">{comment.username}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 leading-none">{getRelativeTime(comment.timestamp)}</span>
                      </div>
                      {/* Comment text on second line */}
                      <span className="text-sm text-gray-900 leading-none block">{comment.content}</span>
                    </div>
                    
                    {/* Right side - Like Button and Count - Aligned with username */}
                    <div className="flex flex-col items-center gap-0.5 ml-3">
                      <button className="flex items-center justify-center hover:opacity-80 transition-opacity p-0 focus:outline-none focus:ring-0 focus:border-0">
                        <Heart className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <span className="text-xs text-gray-500 font-normal leading-none">{comment.likes}</span>
                    </div>
                  </div>
                  
                  {/* Actions Row - Below comment text */}
                  <div className="flex items-center gap-4">
                    <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors leading-none focus:outline-none focus:ring-0 focus:border-0">Reply</button>
                    <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors leading-none focus:outline-none focus:ring-0 focus:border-0">See translation</button>
                  </div>
                  
                  {/* Replies - Only show one reply per comment */}
                  {comment.replies.length > 0 && (
                                         <div className="mt-6 ml-0">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 mb-0 pb-0">
                          {/* Reply Profile Picture - Left side */}
                          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 flex items-start">
                            <img 
                              src={reply.profilePic} 
                              alt={reply.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Reply Content Block - Right side */}
                          <div className="flex-1 min-w-0">
                            {/* Reply Username, Timestamp, Reply Text, and Like Button */}
                            <div className="flex items-start justify-between mb-2">
                              {/* Left side - Username, Timestamp, and Reply Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-1.5 mb-1">
                                  <span className="font-semibold text-sm text-gray-900 leading-none">{reply.username}</span>
                                  <span className="text-xs text-gray-500 flex-shrink-0 leading-none">{getRelativeTime(reply.timestamp)}</span>
                                </div>
                                <span className="text-sm text-gray-900 leading-none block">{reply.content}</span>
                              </div>
                              
                              {/* Right side - Like Button and Count - Aligned with username */}
                              <div className="flex flex-col items-center gap-0.5 ml-3">
                                <button className="flex items-center justify-center hover:opacity-80 transition-opacity p-0 focus:outline-none focus:ring-0 focus:border-0">
                                  <Heart className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                                <span className="text-xs text-gray-500 font-normal leading-none">{reply.likes}</span>
                              </div>
                            </div>
                            
                            {/* Reply Actions Row - Below reply text */}
                            <div className="flex items-center gap-4">
                              <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors leading-none focus:outline-none focus:ring-0 focus:border-0">Reply</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Comment Input */}
        <div className="px-4 py-4 border-t border-gray-200 bg-white mt-auto">
          <div className="flex gap-3">
            {/* User Avatar - Left side */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGNUY1RjUiIHN0cm9rZT0iI0Q5RDlEOSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNC41IiBmaWxsPSIjOUNBNEFCIi8+CjxwYXRoIGQ9Ik0yOCAyN0MyOCAyNC4yNzk3IDI0LjQxODMgMjIgMjAgMjJDMTUuNTgxNyAyMiAxMiAyNC4yNzk3IDEyIDI3SDI4WiIgZmlsbD0iIzlDQTRBQiIvPgo8L3N2Zz4K" 
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            </div>
            
                        {/* Input Field and Actions Block - Right side */}
            <div className="flex-1 flex items-center justify-center gap-3">
              {/* Input Field */}
              <div className="w-3/4 bg-gray-50 rounded-full px-4 py-2 min-h-[36px] flex items-center relative">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none resize-none pr-12 leading-none focus:outline-none focus:ring-0 focus:border-0 focus:border-transparent focus:shadow-none focus:appearance-none focus:border-none comment-input-no-focus"
                  style={{ 
                    minHeight: '16px',
                    border: 'none !important',
                    outline: 'none !important',
                    boxShadow: 'none !important',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    borderWidth: '0 !important',
                    borderStyle: 'none !important',
                    borderColor: 'transparent !important'
                  }}
                />
              </div>
              
              {/* Post Button - Always visible, disabled when no text */}
              <button 
                className={`w-10 h-10 flex items-center justify-center transition-colors focus:outline-none focus:ring-0 focus:border-0 ${
                  commentText.trim() 
                    ? 'text-blue-500 hover:text-blue-600' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (commentText.trim()) {
                    // Add the comment text as a keyword
                    const currentKeywords = getCurrentKeywords();
                    const setCurrentKeywords = getCurrentKeywordsSetter();
                    if (!currentKeywords.includes(commentText.trim())) {
                      const updatedKeywords = [...currentKeywords, commentText.trim()];
                      setCurrentKeywords(updatedKeywords);
                      setSelectedKeywords(updatedKeywords);
                    }
                    // Clear both input fields
                    setCommentText('');
                    setCommentInputText('');
                  }
                }}
                disabled={!commentText.trim()}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AutomationStepByStep() {
  console.log('AutomationStepByStep component loaded successfully')
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Step flow state
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [contentType, setContentType] = useState('')
  const [automationType, setAutomationType] = useState('')
  const [selectedAutomationType, setSelectedAutomationType] = useState<string>('')
  const [selectedPost, setSelectedPost] = useState<any>(null)
  
  // Get current workspace
  const { currentWorkspace } = useCurrentWorkspace()

  // Fetch real Instagram accounts for current workspace
  const { data: socialAccountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/social-accounts', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return []
      const response = await apiRequest(`/api/social-accounts?workspaceId=${currentWorkspace.id}`)
      return response
    },
    enabled: !!currentWorkspace?.id
  })

  // Transform real account data
  const realAccounts = socialAccountsData ? socialAccountsData.map((account: any) => ({
    id: account.id,
    name: `@${account.username}`,
    followers: `${account.followers} followers`,
    platform: account.platform,
    avatar: account.profilePictureUrl || `https://picsum.photos/40/40?random=${account.id}`,
    workspaceId: account.workspaceId
  })) : []
  
  // Fetch real Instagram posts when account is selected
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/instagram-content', selectedAccount],
    queryFn: async () => {
      if (!selectedAccount) return []
      // Get workspace ID from social accounts data
      const selectedAccountData = realAccounts.find((acc: any) => acc.id === selectedAccount)
      const workspaceId = selectedAccountData?.workspaceId || '6847b9cdfabaede1706f2994'
      
      const response = await apiRequest(`/api/instagram-content?workspaceId=${workspaceId}`)
      return response
    },
    enabled: !!selectedAccount && !!socialAccountsData
  })
  
  // Create automation rule mutation
  const createAutomationMutation = useMutation({
    mutationFn: async (automationData: any) => {
      return await apiRequest('/api/automation/rules', {
        method: 'POST',
        body: JSON.stringify(automationData)
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule created successfully",
      })
      // Refetch the rules to show the new rule
      refetchRules()
      // Reset form or redirect
      setCurrentStep(1)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create automation rule",
        variant: "destructive",
      })
    }
  })
  
  // Automation-specific states
  const [keywords, setKeywords] = useState<string[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [commentReply, setCommentReply] = useState('')
  const [dmMessage, setDmMessage] = useState('')
  const [showAutomationList, setShowAutomationList] = useState(false)

  // Fetch existing automation rules
  const { data: automationRules, isLoading: rulesLoading, refetch: refetchRules } = useQuery({
    queryKey: ['/api/automation/rules', realAccounts?.[0]?.workspaceId],
    queryFn: async () => {
      const workspaceId = realAccounts?.[0]?.workspaceId
      if (!workspaceId) return []
      const response = await apiRequest(`/api/automation/rules?workspaceId=${workspaceId}`)
      return response.rules || []
    },
    enabled: !!realAccounts?.[0]?.workspaceId
  })

  // Mutation for updating automation rules
  const updateAutomationMutation = useMutation({
    mutationFn: async ({ ruleId, updates }: { ruleId: string, updates: any }) => {
      return await apiRequest(`/api/automation/rules/${ruleId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule updated successfully",
      })
      refetchRules()
    }
  })

  // Mutation for deleting automation rules
  const deleteAutomationMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      return await apiRequest(`/api/automation/rules/${ruleId}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Automation rule deleted successfully",
      })
      refetchRules()
    }
  })
  
  // Function to create automation rule
  const createAutomationRule = async () => {
    if (!selectedAccount || !selectedPost || !automationType) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    // Get the workspace ID from selected account data
    const selectedAccountData = realAccounts.find((acc: any) => acc.id === selectedAccount)
    const workspaceId = selectedAccountData?.workspaceId
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "No workspace found for selected account.",
        variant: "destructive",
      })
      return
    }

    // Get current keywords and responses based on automation type
    const currentKeywords = getCurrentKeywords()
    const currentResponses = getCurrentResponses()
    
    // NEW SYSTEM FORMAT - matches what the new-automation-system.ts expects
    const ruleData = {
      name: `${automationType === 'comment_only' ? 'Comment' : automationType === 'dm_only' ? 'DM' : 'Comment to DM'} Automation`,
      workspaceId: workspaceId,
      type: automationType, // Use exact automation type (comment_dm, dm_only, comment_only)
      keywords: currentKeywords,
             targetMediaIds: selectedPost ? [selectedPost.id] : [],
      responses: currentResponses,
      isActive: true
    }

    try {
      console.log('Creating automation rule with data:', ruleData)
      await createAutomationMutation.mutateAsync(ruleData)
    } catch (error: any) {
      console.error('Error creating automation rule:', error)
      console.error('Error details:', error.response?.data || error)
    }
  }
  const [previewComment, setPreviewComment] = useState('Amazing content! info please!')
  
  // Multiple comment replies and delay settings
  const [commentReplies, setCommentReplies] = useState(['Message sent!', 'Found it? 😊', 'Sent just now! ⏰'])
  const [commentDelay, setCommentDelay] = useState(15)
  const [commentDelayUnit, setCommentDelayUnit] = useState('minutes')
  
  // DM configuration fields
  const [dmButtonText, setDmButtonText] = useState('See products')
  const [dmWebsiteUrl, setDmWebsiteUrl] = useState('')
  
  // DM-only automation
  const [dmKeywords, setDmKeywords] = useState<string[]>([])
  const [dmAutoReply, setDmAutoReply] = useState('')
  
  // Comment-only automation
  const [commentKeywords, setCommentKeywords] = useState<string[]>([])
  const [publicReply, setPublicReply] = useState('')
  
  // New state for comment input synchronization
  const [commentInputText, setCommentInputText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const updateSourceRef = useRef<'trigger' | 'comment' | null>(null);
  
  // Update current time every 30 seconds to prevent timestamp fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  // Remove focus outlines from all buttons globally
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      button:focus {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }
      button:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Synchronize commentInputText changes back to newKeyword
  useEffect(() => {
    // Only update newKeyword when commentInputText changes from CommentScreen
    // Don't update if it's the same value to prevent feedback loop
    if (commentInputText !== newKeyword && commentInputText !== '' && updateSourceRef.current === 'comment') {
      setNewKeyword(commentInputText);
    }
  }, [commentInputText]);
  
  // Additional state variables for automation settings
  const [aiPersonality, setAiPersonality] = useState('friendly')
  const [maxRepliesPerDay, setMaxRepliesPerDay] = useState(10)
  const [cooldownPeriod, setCooldownPeriod] = useState(30) // in minutes
  const [activeHours, setActiveHours] = useState({ start: '09:00', end: '17:00' })
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false])
  
  // UI state for dropdowns
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [contentTypeDropdownOpen, setContentTypeDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Refs for dropdown click outside handling
  const accountDropdownRef = useRef(null)
  const contentTypeDropdownRef = useRef(null)
  
  // Helper function to get current keywords based on automation type
  const getCurrentKeywords = () => {
    switch (automationType) {
      case 'comment_dm':
        return keywords
      case 'dm_only':
        return dmKeywords
      case 'comment_only':
        return commentKeywords
      default:
        return keywords
    }
  }

  // Helper function to get current responses based on automation type
  const getCurrentResponses = () => {
    switch (automationType) {
      case 'comment_dm':
        return {
          responses: commentReplies.filter(reply => reply.trim().length > 0),
          dmResponses: dmMessage ? [dmMessage] : []
        }
      case 'dm_only':
        return {
          responses: [],
          dmResponses: dmAutoReply ? [dmAutoReply] : []
        }
      case 'comment_only':
        return {
          responses: publicReply ? [publicReply] : [],
          dmResponses: []
        }
      default:
        return {
          responses: [],
          dmResponses: []
        }
    }
  }
  

  
  // Modern dropdown states
  const [automationTypeDropdownOpen, setAutomationTypeDropdownOpen] = useState(false)
  
  // Refs for dropdown management
  const automationTypeDropdownRef = useRef<HTMLDivElement>(null)
  
  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false)
      }
      if (contentTypeDropdownRef.current && !contentTypeDropdownRef.current.contains(event.target as Node)) {
        setContentTypeDropdownOpen(false)
      }
      if (automationTypeDropdownRef.current && !automationTypeDropdownRef.current.contains(event.target as Node)) {
        setAutomationTypeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'bg-pink-500' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: 'bg-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: <PlayCircle className="w-5 h-5" />, color: 'bg-black' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, color: 'bg-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: 'bg-blue-700' }
  ]

  const getContentTypesByPlatform = (platform: any) => {
    switch (platform) {
      case 'instagram':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'Regular Instagram posts', color: 'bg-blue-500' },
          { id: 'reel', name: 'Reel', icon: <PlayCircle className="w-5 h-5" />, description: 'Instagram Reels', color: 'bg-purple-500' },
          { id: 'story', name: 'Story', icon: <Eye className="w-5 h-5" />, description: 'Instagram Stories', color: 'bg-green-500' }
        ]
      case 'youtube':
        return [
          { id: 'video', name: 'Video', icon: <PlayCircle className="w-5 h-5" />, description: 'YouTube Videos', color: 'bg-red-500' },
          { id: 'short', name: 'Short', icon: <Camera className="w-5 h-5" />, description: 'YouTube Shorts', color: 'bg-orange-500' },
          { id: 'live', name: 'Live Stream', icon: <Eye className="w-5 h-5" />, description: 'YouTube Live Streams', color: 'bg-red-600' }
        ]
      case 'tiktok':
        return [
          { id: 'video', name: 'Video', icon: <PlayCircle className="w-5 h-5" />, description: 'TikTok Videos', color: 'bg-gray-800' },
          { id: 'live', name: 'Live', icon: <Eye className="w-5 h-5" />, description: 'TikTok Live', color: 'bg-gray-600' }
        ]
      case 'twitter':
        return [
          { id: 'tweet', name: 'Tweet', icon: <MessageCircle className="w-5 h-5" />, description: 'Twitter Posts', color: 'bg-blue-400' },
          { id: 'thread', name: 'Thread', icon: <MessageSquare className="w-5 h-5" />, description: 'Twitter Threads', color: 'bg-blue-500' }
        ]
      case 'facebook':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'Facebook Posts', color: 'bg-blue-600' },
          { id: 'story', name: 'Story', icon: <Eye className="w-5 h-5" />, description: 'Facebook Stories', color: 'bg-blue-500' },
          { id: 'reel', name: 'Reel', icon: <PlayCircle className="w-5 h-5" />, description: 'Facebook Reels', color: 'bg-blue-700' }
        ]
      case 'linkedin':
        return [
          { id: 'post', name: 'Post', icon: <Camera className="w-5 h-5" />, description: 'LinkedIn Posts', color: 'bg-blue-700' },
          { id: 'article', name: 'Article', icon: <FileText className="w-5 h-5" />, description: 'LinkedIn Articles', color: 'bg-blue-600' }
        ]
      default:
        return []
    }
  }

  const automationTypes = [
    { 
      id: 'comment_dm', 
      name: 'Comment → DM', 
      icon: <MessageCircle className="w-5 h-5" />, 
      description: 'Reply to comments publicly, then send private DM',
      color: 'bg-blue-500'
    },
    { 
      id: 'dm_only', 
      name: 'DM Only', 
      icon: <Send className="w-5 h-5" />, 
      description: 'Send direct messages only (no public replies)',
      color: 'bg-purple-500'
    },
    { 
      id: 'comment_only', 
      name: 'Comment Only', 
      icon: <MessageCircle className="w-5 h-5" />, 
      description: 'Reply to comments publicly only',
      color: 'bg-green-500'
    }
  ]

  // Test if video URL is accessible
  const testVideoUrl = async (url: string, postId: string) => {
    if (!url) return false;
    try {
      console.log(`🔍 Testing video URL accessibility for post ${postId}:`, url);
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`✅ Video URL test result for post ${postId}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      return response.ok;
    } catch (error) {
      console.log(`❌ Video URL test failed for post ${postId}:`, error);
      return false;
    }
  };

  // Transform real posts data
  const realPosts = postsData ? postsData.map((post: any) => {
    console.log('Processing post data:', post); // Debug log
    
    // Map Instagram content types properly
    let mappedType = 'post';
    if (post.type === 'reel' || post.type === 'video') {
      mappedType = 'reel'; // Both reels and videos should show as reels for automation
    } else if (post.type === 'carousel') {
      mappedType = 'post'; // Carousels are treated as posts
    } else if (post.type === 'story') {
      mappedType = 'story';
    }
    
    return {
      id: post.id,
      title: post.caption ? post.caption.substring(0, 30) + '...' : 'Instagram Post',
      type: mappedType,
      image: post.mediaUrl || post.thumbnailUrl || 'https://picsum.photos/300/300?random=1',
      mediaUrl: post.mediaUrl,
      thumbnailUrl: post.thumbnailUrl,
      likes: post.engagement?.likes || 0,
      comments: post.engagement?.comments || 0,
      caption: post.caption || 'Instagram post content'
    };
  }) : []

  // Dynamic steps based on automation type
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: 'Select Setup', description: 'Account, content & post' },
      { id: 2, title: 'Automation Config', description: 'Choose & configure automation' }
    ]
    
    // For comment to DM, add separate comment and DM steps
    if (automationType === 'comment_dm') {
      return [
        ...baseSteps,
        { id: 3, title: 'DM Configuration', description: 'Setup private message' },
        { id: 4, title: 'Advanced Settings', description: 'Fine-tune timing' },
        { id: 5, title: 'Review & Activate', description: 'Review and activate' }
      ]
    }
    
    // For other types, keep original flow
    return [
      ...baseSteps,
      { id: 3, title: 'Advanced Settings', description: 'Fine-tune timing' },
      { id: 4, title: 'Review & Activate', description: 'Review and activate' }
    ]
  }
  
  const steps = getSteps()

  // Function to get content types based on selected platform/account
  const getContentTypesForPlatform = (accountId) => {
    const account = realAccounts.find(acc => acc.id === accountId)
    if (!account) return []
    
    switch (account.platform.toLowerCase()) {
      case 'instagram':
        return [
          { id: 'post', name: 'Post', description: 'Regular feed posts', icon: '📷' },
          { id: 'reel', name: 'Reel', description: 'Short video content', icon: '🎬' },
          { id: 'story', name: 'Story', description: '24h disappearing content', icon: '⭕' }
        ]
      case 'youtube':
        return [
          { id: 'video', name: 'Video', description: 'Long-form videos', icon: '📹' },
          { id: 'short', name: 'Short', description: 'Vertical short videos', icon: '⚡' }
        ]
      case 'linkedin':
        return [
          { id: 'post', name: 'Post', description: 'Professional updates', icon: '💼' },
          { id: 'article', name: 'Article', description: 'Long-form content', icon: '📄' }
        ]
      case 'twitter':
        return [
          { id: 'tweet', name: 'Tweet', description: 'Short messages', icon: '🐦' },
          { id: 'thread', name: 'Thread', description: 'Connected tweets', icon: '🧵' }
        ]
      default:
        return [
          { id: 'post', name: 'Post', description: 'General content', icon: '📝' }
        ]
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = getCurrentKeywords()
      const setCurrentKeywords = getCurrentKeywordsSetter()
      if (!currentKeywords.includes(newKeyword.trim())) {
        const updatedKeywords = [...currentKeywords, newKeyword.trim()]
        setCurrentKeywords(updatedKeywords)
        setSelectedKeywords(updatedKeywords) // Update selected keywords for comment screen
        setNewKeyword('')
        setCommentInputText('') // Clear comment input text as well
        
        // Show comment screen for comment-related automations when keywords are added
        if ((automationType === 'comment_dm' || automationType === 'comment_only') && updatedKeywords.length === 1) {
          setShowCommentScreen(true)
        }
      }
    }
  }

  const removeKeyword = (keywordToRemove) => {
    const currentKeywords = getCurrentKeywords()
    const setCurrentKeywords = getCurrentKeywordsSetter()
    const updatedKeywords = currentKeywords.filter(k => k !== keywordToRemove)
    setCurrentKeywords(updatedKeywords)
    setSelectedKeywords(updatedKeywords) // Update selected keywords for comment screen
  }



  const getCurrentKeywordsSetter = (): React.Dispatch<React.SetStateAction<string[]>> => {
    switch (automationType) {
      case 'comment_dm':
        return setKeywords
      case 'comment_only':
        return setCommentKeywords
      case 'dm_only':
        return setDmKeywords
      default:
        return setKeywords
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedAccount && contentType && selectedPost !== null
      case 2:
        // For comment_dm automation, require keywords and at least one comment reply
        if (automationType === 'comment_dm') {
          return automationType && getCurrentKeywords().length > 0 && commentReplies.some(reply => reply.trim().length > 0)
        }
        return automationType && getCurrentKeywords().length > 0 // Automation type and keywords required for configuration
      case 3:
        // For comment_dm automation, step 3 is DM configuration - require DM message and button text
        if (automationType === 'comment_dm') {
          return dmMessage.trim().length > 0 && dmButtonText.trim().length > 0
        }
        // For other automation types, step 3 is Advanced settings - optional
        return true
      case 4:
        // For comment_dm automation, step 4 is Advanced settings - optional
        // For other automation types, step 4 is Review step - always allow
        return true
      case 5:
        // Step 5 is only for comment_dm automation - Review step - always allow
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length) {
      // Reset content type when account changes and auto-set platform
      if (currentStep === 1) {
        setContentType('')
        // Auto-set platform based on selected account
        const selectedAccountData = realAccounts.find(a => a.id === selectedAccount)
        if (selectedAccountData) {
          setSelectedPlatform(selectedAccountData.platform.toLowerCase())
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    // Create the automation rule with real API call
    await createAutomationRule()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Step 1: Select Account */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                Select Account
              </h3>
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    {selectedAccount && !accountsLoading && (
                      <img 
                        src={realAccounts.find(acc => acc.id === selectedAccount)?.avatar} 
                        alt={realAccounts.find(acc => acc.id === selectedAccount)?.name}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none'
                          const fallback = e.currentTarget.nextElementSibling
                          if (fallback) (fallback as HTMLElement).style.display = 'flex'
                        }}
                      />
                    )}
                    {selectedAccount && !accountsLoading && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500" style={{display: 'none'}}>
                        <span className="text-white text-xs font-bold">
                          {realAccounts.find((acc: any) => acc.id === selectedAccount)?.name?.charAt(1).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className={selectedAccount ? 'text-gray-900' : 'text-gray-500'}>
                      {accountsLoading ? 'Loading accounts...' : selectedAccount 
                        ? realAccounts.find((acc: any) => acc.id === selectedAccount)?.name + ' • ' + realAccounts.find((acc: any) => acc.id === selectedAccount)?.followers + ' • ' + realAccounts.find((acc: any) => acc.id === selectedAccount)?.platform
                        : 'Choose your social media account...'
                      }
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {accountDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search accounts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="py-1">
                      {realAccounts
                        .filter((account: any) => 
                          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.platform.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((account: any) => (
                          <button
                            key={account.id}
                            onClick={() => {
                              setSelectedAccount(account.id)
                              setAccountDropdownOpen(false)
                              setSearchTerm('')
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-3">
                              <img 
                                src={account.avatar} 
                                alt={account.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none'
                                  const fallback = e.currentTarget.nextElementSibling
                                  if (fallback) (fallback as HTMLElement).style.display = 'flex'
                                }}
                              />
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${account.platform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : account.platform === 'youtube' ? 'bg-red-500' : 'bg-blue-500'}`} style={{display: 'none'}}>
                                <span className="text-white text-xs font-bold">
                                  {account.name.charAt(1).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{account.name}</div>
                                <div className="text-sm text-gray-500">{account.followers} • {account.platform}</div>
                              </div>
                            </div>
                            {selectedAccount === account.id && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))
                      }
                      {realAccounts.filter((account: any) => 
                        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        account.platform.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">No accounts found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Select Content Type (only shown when account is selected) */}
            {selectedAccount && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-md">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Select Content Type
                </h3>
                <div className="relative" ref={contentTypeDropdownRef}>
                  <button
                    onClick={() => setContentTypeDropdownOpen(!contentTypeDropdownOpen)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-purple-300 focus:border-purple-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                    disabled={!selectedAccount}
                  >
                    <span className={contentType ? 'text-gray-900' : 'text-gray-500'}>
                      {contentType 
                        ? getContentTypesForPlatform(selectedAccount).find(type => type.id === contentType)?.name + ' - ' + getContentTypesForPlatform(selectedAccount).find(type => type.id === contentType)?.description
                        : 'Choose content type for your automation...'
                      }
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${contentTypeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {contentTypeDropdownOpen && selectedAccount && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                      <div className="py-1">
                        {getContentTypesForPlatform(selectedAccount).map(type => (
                          <button
                            key={type.id}
                            onClick={() => {
                              setContentType(type.id)
                              setContentTypeDropdownOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                {type.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{type.name}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </div>
                            {contentType === type.id && (
                              <Check className="w-4 h-4 text-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Select Post (only shown when content type is selected) */}
            {selectedAccount && contentType && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Select Post
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Debug info */}
                  {!postsLoading && (
                    <div className="col-span-full text-xs text-gray-500 mb-2">
                      Debug: Found {realPosts.length} total posts, {realPosts.filter((p: any) => p.type === contentType).length} of type "{contentType}"
                    </div>
                  )}
                  {(postsLoading ? [] : realPosts.filter((post: any) => post.type === contentType)).map((post: any) => (
                    <div
                      key={post.id}
                      className={`cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedPost?.id === post.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="p-3">
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 overflow-hidden">
                          {post.type === 'reel' && post.image ? (
                            // Video player for reels
                            <div className="relative w-full h-full group">
                              {/* Test video URL accessibility */}
                              {(() => {
                                const videoUrl = post.image || post.mediaUrl || post.thumbnailUrl;
                                if (videoUrl) {
                                  testVideoUrl(videoUrl, post.id);
                                }
                                return null;
                              })()}
                              <video
                                src={post.image || post.mediaUrl || post.thumbnailUrl} 
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster={post.thumbnailUrl || post.image}
                                onError={(e) => {
                                  console.log('Live preview video error for post:', post.id, e);
                                  console.log('Live preview video error details:', {
                                    error: e.currentTarget.error,
                                    networkState: e.currentTarget.networkState,
                                    readyState: e.currentTarget.readyState,
                                    src: e.currentTarget.src
                                  });
                                  // Fallback to image if video fails
                                  const video = e.currentTarget;
                                  const img = document.createElement('img');
                                  img.src = post.thumbnailUrl || post.image || post.mediaUrl;
                                  img.className = 'w-full h-full object-cover';
                                  img.alt = post.caption || post.title;
                                  video.parentNode?.replaceChild(img, video);
                                }}
                                onLoadStart={() => console.log('Live preview video loading started for post:', post.id)}
                                onCanPlay={() => console.log('Live preview video can play for post:', post.id)}
                                onLoadedMetadata={() => console.log('Live preview video metadata loaded for post:', post.id)}
                                onLoadedData={() => console.log('Live preview video data loaded for post:', post.id)}
                                onProgress={() => console.log('Live preview video progress for post:', post.id)}
                                onStalled={() => console.log('Live preview video stalled for post:', post.id)}
                                onSuspend={() => console.log('Live preview video suspended for post:', post.id)}
                              />
                              
                              {/* Mute/Unmute button - only visible on hover */}
                              <button
                                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const video = e.currentTarget.parentElement?.querySelector('video');
                                  if (video) {
                                    video.muted = !video.muted;
                                    // Update button icon
                                    const icon = e.currentTarget.querySelector('svg');
                                    if (icon) {
                                      if (video.muted) {
                                        icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
                                      } else {
                                        icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><line x1="1" y1="1" x2="23" y2="23"/>';
                                      }
                                    }
                                  }
                                }}
                                title="Toggle mute"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                                  <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                              </button>
                              
                              <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                                🎬 Reel
                              </div>
                            </div>
                          ) : post.image ? (
                          <img 
                            src={post.image} 
                            alt={post.caption || post.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails
                              e.currentTarget.src = 'https://picsum.photos/300/300?random=1';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{post.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="capitalize flex items-center gap-1">
                              {post.type === 'reel' && <PlayCircle className="w-3 h-3 text-purple-500" />}
                              {post.type}
                            </span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {post.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                        </div>
                    </div>
                  ))}
                </div>
                  {postsLoading && (
                    <div className="col-span-full text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading posts...</p>
                    </div>
                  )}
                {!postsLoading && realPosts.filter((post: any) => post.type === contentType).length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No {contentType}s found for this account
                    <div className="text-sm text-gray-400 mt-2">
                      Available content: {[...new Set(realPosts.map((p: any) => p.type))].join(', ')}
                    </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            {/* Step 1: Choose Automation Type */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Choose Automation Type
              </h3>
              <div className="relative" ref={automationTypeDropdownRef}>
                <button
                  onClick={() => setAutomationTypeDropdownOpen(!automationTypeDropdownOpen)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-emerald-300 focus:border-emerald-500 focus:outline-none transition-all duration-200 text-gray-800 font-medium text-left flex items-center justify-between group"
                >
                  <span className={automationType ? 'text-gray-900' : 'text-gray-500'}>
                    {automationType 
                      ? automationTypes.find(type => type.id === automationType)?.name + ' - ' + automationTypes.find(type => type.id === automationType)?.description
                      : 'Select automation type...'
                    }
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${automationTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {automationTypeDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto dropdown-enter">
                    <div className="py-1">
                      {automationTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setAutomationType(type.id)
                            setSelectedAutomationType(type.id)
                            setAutomationTypeDropdownOpen(false)
                            // Don't show comment screen immediately - wait for keywords to be added
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors duration-150 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white`}>
                              {type.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </div>
                          {automationType === type.id && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Configuration (appears after automation type selection) */}
            {automationType && (
              <div className="animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    Configuration
                  </h4>
                  {renderAutomationSpecificConfig()}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        // For comment_dm automation, step 3 is DM configuration
        if (automationType === 'comment_dm') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a direct message</h3>
                <p className="text-sm text-gray-600 mb-6">Write the DM you want sent when users include your keyword when they comment on your post.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Direct message</label>
                    <p className="text-sm text-gray-600 mb-3">We'll send this DM to the user who included your keyword in their comment.</p>
                    <textarea
                      value={dmMessage}
                      onChange={(e) => setDmMessage(e.target.value)}
                      placeholder="Enter your DM text here"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button text</label>
                    <input
                      type="text"
                      value={dmButtonText}
                      onChange={(e) => setDmButtonText(e.target.value)}
                      placeholder="Choose a short and clear button text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <input
                      type="text"
                      value={dmWebsiteUrl}
                      onChange={(e) => setDmWebsiteUrl(e.target.value)}
                      placeholder="Enter the destination URL for your button"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        }

        // For other automation types, step 3 is Advanced Settings
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Replies per Day</label>
                  <input
                    type="number"
                    value={maxRepliesPerDay}
                    onChange={(e) => setMaxRepliesPerDay(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooldown Period (minutes)</label>
                  <input
                    type="number"
                    value={cooldownPeriod}
                    onChange={(e) => setCooldownPeriod(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="1440"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Personality</label>
                <select
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="witty">Witty</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Start Time</label>
                  <input
                    type="time"
                    value={activeHours.start}
                    onChange={(e) => setActiveHours({...activeHours, start: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active End Time</label>
                  <input
                    type="time"
                    value={activeHours.end}
                    onChange={(e) => setActiveHours({...activeHours, end: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Active Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newActiveDays = [...activeDays]
                        newActiveDays[index] = !newActiveDays[index]
                        setActiveDays(newActiveDays)
                      }}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        activeDays[index]
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        // For comment_dm automation, step 4 is Advanced Settings
        if (automationType === 'comment_dm') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  Advanced Settings
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Replies per Day</label>
                    <input
                      type="number"
                      value={maxRepliesPerDay}
                      onChange={(e) => setMaxRepliesPerDay(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      min="1"
                      max="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cooldown Period (minutes)</label>
                    <input
                      type="number"
                      value={cooldownPeriod}
                      onChange={(e) => setCooldownPeriod(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      min="1"
                      max="1440"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Personality</label>
                  <select
                    value={aiPersonality}
                    onChange={(e) => setAiPersonality(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="witty">Witty</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Active Start Time</label>
                    <input
                      type="time"
                      value={activeHours.start}
                      onChange={(e) => setActiveHours({...activeHours, start: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Active End Time</label>
                    <input
                      type="time"
                      value={activeHours.end}
                      onChange={(e) => setActiveHours({...activeHours, end: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Active Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newActiveDays = [...activeDays]
                          newActiveDays[index] = !newActiveDays[index]
                          setActiveDays(newActiveDays)
                        }}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          activeDays[index]
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        }
        
        // For other automation types, step 4 is Review & Activate
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                Review & Activate
              </h3>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Account:</span>
                    <div className="text-lg font-semibold text-gray-900">{realAccounts.find((a: any) => a.id === selectedAccount)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Selected Post:</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedPost ? (
                        <span>{selectedPost.type || 'Post'} - {selectedPost.caption ? selectedPost.caption.substring(0, 30) + '...' : 'No caption'}</span>
                      ) : (
                        'Not selected'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Automation Type:</span>
                    <div className="text-lg font-semibold text-gray-900">{automationTypes.find((t: any) => t.id === automationType)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Keywords:</span>
                    <div className="text-lg font-semibold text-gray-900">{getCurrentKeywords().length} keywords</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Daily Limit:</span>
                    <div className="text-lg font-semibold text-gray-900">{maxRepliesPerDay} replies</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">AI Personality:</span>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{aiPersonality}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        // Step 5 is only for comment_dm automation - Review & Activate
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                Review & Activate
              </h3>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Account:</span>
                    <div className="text-lg font-semibold text-gray-900">{realAccounts.find((a: any) => a.id === selectedAccount)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Selected Post:</span>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedPost ? (
                        <span>{selectedPost.type || 'Post'} - {selectedPost.caption ? selectedPost.caption.substring(0, 30) + '...' : 'No caption'}</span>
                      ) : (
                        'Not selected'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Automation Type:</span>
                    <div className="text-lg font-semibold text-gray-900">{automationTypes.find((t: any) => t.id === automationType)?.name || 'Not selected'}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Keywords:</span>
                    <div className="text-lg font-semibold text-gray-900">{getCurrentKeywords().length} keywords</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Daily Limit:</span>
                    <div className="text-lg font-semibold text-gray-900">{maxRepliesPerDay} replies</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">AI Personality:</span>
                    <div className="text-lg font-semibold text-gray-900 capitalize">{aiPersonality}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )





      default:
        return null
    }
  }

  const renderAutomationSpecificConfig = () => {
    const currentKeywords = getCurrentKeywords()
    
    switch (automationType) {
      case 'comment_dm':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Reply Configuration</h3>
              <p className="text-sm text-gray-600 mb-6">Configure the public comment that will be posted when keywords are detected. DM settings will be configured in the next step.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => {
                      updateSourceRef.current = 'trigger';
                      setNewKeyword(e.target.value);
                      setCommentInputText(e.target.value);
                      // Reset the source after a short delay
                      setTimeout(() => updateSourceRef.current = null, 100);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Preview Comments Button */}
                {keywords.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowCommentScreen(true)}
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Comments
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment replies</label>
                <p className="text-sm text-gray-600 mb-4">Write a few different possible responses, and we'll cycle through them so your responses seem more genuine and varied.</p>
                
                <div className="space-y-3 mb-4">
                  {commentReplies.map((reply, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
                      <input
                        type="text"
                        value={reply}
                        onChange={(e) => {
                          const newReplies = [...commentReplies]
                          newReplies[index] = e.target.value
                          setCommentReplies(newReplies)
                        }}
                        placeholder="Enter comment reply..."
                        className="flex-1 p-2 border-0 focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => {
                          const newReplies = commentReplies.filter((_, i) => i !== index)
                          setCommentReplies(newReplies)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setCommentReplies([...commentReplies, ''])}
                  className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add another reply
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay before comment</label>
                <p className="text-sm text-gray-600 mb-4">Adding a short delay before responding to comments helps your replies seem more thoughtful and authentic.</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={commentDelay}
                      onChange={(e) => setCommentDelay(Number(e.target.value))}
                      min="1"
                      max="60"
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                    />
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <select
                    value={commentDelayUnit}
                    onChange={(e) => setCommentDelayUnit(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="seconds">Seconds</option>
                    <option value="hours">Hours</option>
                  </select>
                  <X className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </>
        )

      case 'dm_only':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DM Only Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dmKeywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Preview Comments Button */}
                {dmKeywords.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowCommentScreen(true)}
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Comments
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto DM Message</label>
                <textarea
                  value={dmAutoReply}
                  onChange={(e) => setDmAutoReply(e.target.value)}
                  placeholder="Thanks for your comment! Here's the information you requested..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
            </div>
          </>
        )

      case 'comment_only':
        return (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Only Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Preview Comments Button */}
                {keywords.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowCommentScreen(true)}
                      className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview Comments
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Reply Message</label>
                <textarea
                  value={publicReply}
                  onChange={(e) => setPublicReply(e.target.value)}
                  placeholder="Thanks for your interest! Here's the info you requested..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
            </div>
          </>
        )



      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Please select an automation type first.</p>
          </div>
        )
    }
  }

  const renderInstagramPreview = () => {
    const selectedAccountData = realAccounts.find((a: any) => a.id === selectedAccount)
    const selectedPostData = selectedPost
    const currentKeywords = getCurrentKeywords()
    const platformName = selectedAccountData?.platform || 'Social Media'
    

    
    // For comment_dm automation in step 3 (DM configuration), show only DM preview
    if (automationType === 'comment_dm' && currentStep === 3) {
      return (
        <div className="sticky top-4">
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold">DM Preview</h3>
                <p className="text-sm opacity-90">Instagram direct message interface</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Instagram DM Preview - Exact match to reference image */}
          <div className="bg-white border border-gray-200 rounded-b-3xl shadow-sm max-w-sm mx-auto">
            <div className="p-4">
              {/* Message timestamp */}
              <div className="text-xs text-gray-500 text-center mb-4">
                JUL 15, 08:31 PM
              </div>
              
              {/* Message bubble with profile picture at bottom-left corner */}
              <div className="relative mb-4">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[280px] ml-6">
                  <div className="text-sm text-gray-400">
                    {dmMessage || "I'm so excited you'd like to see what I've got on offer!"}
                  </div>
                  
                  {/* Button inside message bubble - white background */}
                  {dmButtonText && (
                    <div className="bg-white rounded-lg p-3 text-center mt-3">
                      <div className="text-sm font-medium text-gray-800">
                        {dmButtonText}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile picture positioned at bottom-left corner overlapping the message bubble */}
                <img 
                  src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                  alt="Profile" 
                  className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-white bg-white ml-[-11px] mr-[-11px] pl-[0px] pr-[0px] mt-[1px] mb-[1px]" 
                />
              </div>
              
              {/* Message input area */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2">
                  Message...
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 text-gray-500">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Get current automation message based on type - for PUBLIC comment reply
    const getCurrentMessage = () => {
      switch (automationType) {
        case 'comment_dm':
          return commentReplies[0] || 'Thanks for your comment! Check your DMs 📩'
        case 'dm_only':
          return '' // No public comment for DM-only
        case 'comment_only':
          return commentReplies[0] || 'Thanks for your interest! Here\'s what you\'re looking for ✨'
        default:
          return 'Your automated response will appear here...'
      }
    }
    
    // Get DM message for DM preview
    const getDMMessage = () => {
      switch (automationType) {
        case 'comment_dm':
          return dmMessage || 'Here\'s the detailed info you requested! 💫'
        case 'dm_only':
          return dmAutoReply || 'Thanks for reaching out! Here\'s the info you need 💫'
        default:
          return ''
      }
    }
    
    return (
      <div className="sticky top-4">
        {/* Preview Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold">Live Preview</h3>
              <p className="text-sm opacity-90">Real-time automation preview</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Instagram Post Interface - Exact replica */}
        <div className="bg-white border-l border-r border-gray-200 shadow-2xl">
          {/* Post Header - Only show for non-reel posts */}
          {selectedPostData && selectedPostData.type !== 'reel' && (
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200" 
                />
                {selectedAccount && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {selectedAccountData?.name || 'your_account'}
                </div>
                <div className="text-xs text-gray-500">2 hours ago • 📍 Location</div>
              </div>
            </div>
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </div>
          )}
          
          {/* Instagram Reel Style Preview */}
          <div className="relative bg-black">
            {selectedPostData ? (
              selectedPostData.type === 'reel' ? (
                // Instagram Reel Layout - Full Screen Vertical Video
                <div className="relative w-full h-[600px] bg-black">
                  {/* Video Player - Full Screen */}
                  <video 
                    src={selectedPostData.image || selectedPostData.mediaUrl || selectedPostData.thumbnailUrl} 
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={selectedPostData.thumbnailUrl || selectedPostData.image}
                    onPlay={(e) => {
                      // Video started playing - show pause icon and hide button after delay
                      const video = e.currentTarget;
                      const button = video.parentElement?.querySelector('.play-pause-button') as HTMLElement;
                      const playIcon = button?.querySelector('svg:first-child');
                      const pauseIcon = button?.querySelector('svg:last-child');
                      
                      if (button && playIcon && pauseIcon) {
                        // Show pause icon
                        (playIcon as HTMLElement).style.display = 'none';
                        (pauseIcon as HTMLElement).style.display = 'block';
                        
                        // Show button briefly then hide it
                        button.style.opacity = '1';
                        button.style.transform = 'scale(1)';
                        
                        setTimeout(() => {
                          button.style.opacity = '0';
                          button.style.transform = 'scale(0.8)';
                        }, 2000);
                      }
                    }}
                    onPause={(e) => {
                      // Video paused - show play icon and keep button visible
                      const video = e.currentTarget;
                      const button = video.parentElement?.querySelector('.play-pause-button') as HTMLElement;
                      const playIcon = button?.querySelector('svg:first-child');
                      const pauseIcon = button?.querySelector('svg:last-child');
                      
                      if (button && playIcon && pauseIcon) {
                        // Show play icon
                        (pauseIcon as HTMLElement).style.display = 'none';
                        (playIcon as HTMLElement).style.display = 'block';
                        
                        // Keep button visible when paused
                        button.style.opacity = '1';
                        button.style.transform = 'scale(1)';
                      }
                    }}
                    onError={(e) => {
                      console.log('Live preview video error for post:', selectedPostData.id, e);
                      // Fallback to image if video fails
                      const video = e.currentTarget;
                      const img = document.createElement('img');
                      img.src = selectedPostData.thumbnailUrl || selectedPostData.image || selectedPostData.mediaUrl;
                      img.className = 'w-full h-full object-cover';
                      img.alt = selectedPostData.caption || 'Post';
                      video.parentNode?.replaceChild(img, video);
                    }}
                  />
                  
                  {/* Click Zone for Video Control - Covers video area but excludes bottom automation bar and right sidebar */}
                  <div 
                    className="absolute cursor-pointer pointer-events-auto"
                    style={{ 
                      top: '0', 
                      left: '0', 
                      right: '50px', // Exclude only the exact action buttons width (cut to cut)
                      bottom: '120px' // Exclude the bottom automation bar area
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const video = e.currentTarget.parentElement?.querySelector('video');
                      const button = e.currentTarget.parentElement?.querySelector('.play-pause-button') as HTMLElement;
                      
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                      
                      // Show the button when user clicks
                      if (button) {
                        button.style.opacity = '1';
                        button.style.transform = 'scale(1)';
                        
                        // Hide button after 2 seconds
                        setTimeout(() => {
                          if (video && !video.paused) {
                            button.style.opacity = '0';
                            button.style.transform = 'scale(0.8)';
                          }
                        }, 2000);
                      }
                    }}
                  />
                  
                  {/* Play/Pause Button Overlay - Center of the clickable video area */}
                  <div 
                    className="absolute pointer-events-none flex items-center justify-center"
                    style={{ 
                      top: '0', 
                      left: '0', 
                      right: '50px', // Match the click zone exactly (cut to cut)
                      bottom: '120px' // Exclude only the bottom automation bar area
                    }}
                  >
                    <button
                      className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto transition-all duration-300 play-pause-button focus:outline-none focus:ring-0 focus:border-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const video = e.currentTarget.parentElement?.parentElement?.querySelector('video');
                        if (video) {
                          if (video.paused) {
                            video.play();
                          } else {
                            video.pause();
                          }
                        }
                        
                        // Hide button after click
                        const button = e.currentTarget as HTMLElement;
                        setTimeout(() => {
                          if (video && !video.paused) {
                            button.style.opacity = '0';
                            button.style.transform = 'scale(0.8)';
                          }
                        }, 2000);
                      }}
                      style={{
                        opacity: '0',
                        transform: 'scale(0.8)',
                        transition: 'all 0.3s ease-in-out',
                        zIndex: 100
                      }}

                    >
                      {/* Play Icon - Show when video is paused */}
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-white transition-all duration-300"
                        style={{ display: 'block' }}
                      >
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                      
                      {/* Pause Icon - Show when video is playing */}
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-white transition-all duration-300"
                        style={{ display: 'none' }}
                      >
                        <line x1="6" y1="4" x2="6" y2="20"/>
                        <line x1="18" y1="4" x2="18" y2="20"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Instagram Reel UI Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Top Section - Only Mute Button */}
                    <div className="absolute top-4 right-4">
                      {/* Mute/Unmute Button */}
                      <button
                        className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto hover:bg-black/50 transition-colors focus:outline-none focus:ring-0 focus:border-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const video = e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector('video');
                          if (video) {
                            video.muted = !video.muted;
                            const icon = e.currentTarget.querySelector('svg');
                            if (icon) {
                              if (video.muted) {
                                icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
                              } else {
                                icon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><line x1="1" y1="1" x2="23" y2="23"/>';
                              }
                            }
                          }
                        }}
                        title="Toggle mute"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Bottom Section - Caption, Username, and Actions */}
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      {/* Username and Follow Button Section - Above Caption */}
                      <div className="flex items-center gap-3 mb-4">
                        {/* Profile Picture - Left side - Use real avatar */}
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                          {selectedAccountData?.avatar ? (
                            <img 
                              src={selectedAccountData.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient if avatar fails to load
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback gradient avatar */}
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center" style={{ display: selectedAccountData?.avatar ? 'none' : 'flex' }}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        {/* Username and Follow Button - Right side - Use real username */}
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">
                            {selectedAccountData?.username || selectedAccountData?.name || 'wanderwithsky'}
                          </span>
                          <button className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30 pointer-events-auto hover:bg-white/30 transition-colors focus:outline-none focus:ring-0 focus:border-0">
                            Follow
                          </button>
                        </div>
                      </div>
                      
                      {/* Caption */}
                      <div className="mb-4">
                        <p className="text-white text-sm leading-relaxed">
                          {selectedPostData.caption || 'Instagram reel content...'}
                        </p>
                      </div>
                      
                      {/* Audio Source - Use real username */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-white/80 text-xs">
                          {selectedAccountData?.username || selectedAccountData?.name || 'wanderwithsky'} • Original audio
                        </span>
                      </div>
                      
                      {/* Right Side Action Buttons */}
                      <div 
                        className={`absolute bottom-4 flex flex-col items-center gap-4 transition-opacity duration-300 ${
                          showCommentScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                        style={{ zIndex: 50, right: '0', marginRight: 0, paddingRight: 0 }}
                      >
                        {/* Like Button - Use real likes count */}
                        <div className="flex flex-col items-center">
                          <button className="w-10 h-10 flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform focus:outline-none focus:ring-0 focus:border-0">
                            <Heart className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                          <span className="text-white text-xs mt-1 font-medium drop-shadow-lg">
                            {(selectedPostData.likes || selectedPostData.engagement?.likes || 0).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Comment Button - Use real comments count */}
                        <div className="flex flex-col items-center">
                          <button 
                            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform duration-200 pointer-events-auto focus:outline-none focus:ring-0 focus:border-0"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowCommentScreen(!showCommentScreen);
                            }}
                            style={{ zIndex: 50 }}
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                            </svg>
                            <span className="text-xs font-medium">3</span>
                          </button>
                        </div>
                        
                        {/* Share Button */}
                        <div className="flex flex-col items-center">
                          <button className="w-10 h-10 flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform focus:outline-none focus:ring-0 focus:border-0">
                            <Send className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                        </div>
                        
                        {/* Save Button */}
                        <div className="flex flex-col items-center">
                          <button className="w-10 h-10 flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform focus:outline-none focus:ring-0 focus:border-0">
                            <Bookmark className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                        </div>
                        
                        {/* More Options */}
                        <div className="flex flex-col items-center">
                          <button className="w-10 h-10 flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform focus:outline-none focus:ring-0 focus:border-0">
                            <MoreHorizontal className="w-6 h-6 text-white drop-shadow-lg" />
                          </button>
                        </div>
                        
                        {/* Music Icon - Replaces profile picture */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-white drop-shadow-lg"
                          >
                            <path d="M9 18V5l12-2v13"/>
                            <circle cx="6" cy="18" r="3"/>
                            <circle cx="18" cy="16" r="3"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment Screen Overlay - Positioned within the reel layout */}
                  <CommentScreen 
                    isVisible={showCommentScreen} 
                    onClose={() => setShowCommentScreen(false)}
                    triggerKeywords={selectedKeywords || []}
                    automationType={automationType || 'comment_only'}
                    commentReplies={commentReplies || ['Message sent!']}
                    dmMessage={dmMessage || ''}
                    selectedAccount={selectedAccount || ''}
                    realAccounts={realAccounts || []}
                    newKeyword={newKeyword || ''}
                    commentInputText={commentInputText || ''}
                    setCommentInputText={setCommentInputText}
                    getCurrentKeywords={getCurrentKeywords}
                    getCurrentKeywordsSetter={getCurrentKeywordsSetter}
                    setSelectedKeywords={setSelectedKeywords}
                    updateSourceRef={updateSourceRef}
                    currentTime={currentTime}
                  />
                </div>
              ) : (
                // Regular Post Layout
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <img 
                src={selectedPostData.image || selectedPostData.thumbnailUrl || selectedPostData.mediaUrl} 
                alt="Post" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to other image sources if primary fails
                  if (selectedPostData.mediaUrl && e.currentTarget.src !== selectedPostData.mediaUrl) {
                    e.currentTarget.src = selectedPostData.mediaUrl;
                  } else if (selectedPostData.thumbnailUrl && e.currentTarget.src !== selectedPostData.thumbnailUrl) {
                    e.currentTarget.src = selectedPostData.thumbnailUrl;
                  }
                }}
              />
            
            {/* Multiple image indicator */}
                  {selectedPostData.type === 'carousel' && (
              <div className="absolute top-3 right-3">
                <div className="bg-black/20 backdrop-blur-sm rounded-full p-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Select a post to preview</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Post Actions - Only show for non-reel posts */}
          {selectedPostData && selectedPostData.type !== 'reel' && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors cursor-pointer" />
                <MessageCircle className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
                <Send className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
              </div>
              <Bookmark className="w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer" />
            </div>
            
            {/* Likes count */}
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {selectedPostData ? `${(selectedPostData.likes || selectedPostData.engagement?.likes || 0).toLocaleString()} likes` : '1,247 likes'}
            </div>
            
            {/* Caption */}
              {selectedPostData?.caption && (
                <div className="text-sm text-gray-900 mb-2">
                  <span className="font-semibold mr-2">wanderwithsky</span>
                  {selectedPostData.caption}
                </div>
              )}
              
              {/* Comments */}
              <div className="text-sm text-gray-500">
                View all {(selectedPostData.comments || selectedPostData.engagement?.comments || 0).toLocaleString()} comments
                  </div>
                </div>
              )}
        </div>
        
        {/* DM Preview Section - Only show for comment to DM automation in steps 4 and 5 */}
        {automationType === 'comment_dm' && (currentStep === 4 || currentStep === 5) && (
          <div className="sticky top-4 mt-4">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 rounded-t-3xl">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold">DM Preview</h3>
                  <p className="text-sm opacity-90">Instagram direct message interface</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Instagram DM Preview - Exact match to reference image */}
            <div className="bg-white border border-gray-200 rounded-b-3xl shadow-sm max-w-sm mx-auto">
              <div className="p-4">
                {/* Message timestamp */}
                <div className="text-xs text-gray-500 text-center mb-4">
                  JUL 15, 08:31 PM
                </div>
                
                {/* Message bubble with profile picture at bottom-left corner */}
                <div className="relative mb-4">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[280px] ml-6">
                    <div className="text-sm text-gray-400">
                      {dmMessage || "I'm so excited you'd like to see what I've got on offer!"}
                    </div>
                    
                    {/* Button inside message bubble - white background */}
                    {dmButtonText && (
                      <div className="bg-white rounded-lg p-3 text-center mt-3">
                        <div className="text-sm font-medium text-gray-800">
                          {dmButtonText}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile picture positioned at bottom-left corner overlapping the message bubble */}
                  <img 
                    src={selectedAccountData?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format'} 
                    alt="Profile" 
                    className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-white bg-white ml-[-11px] mr-[-11px] pl-[0px] pr-[0px] mt-[1px] mb-[1px]" 
                  />
                </div>
                
                {/* Message input area */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2">
                    Message...
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="w-6 h-6 text-gray-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Status Indicator */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-b-3xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">
                {automationType ? `${automationTypes.find(t => t.id === automationType)?.name} Active` : 'Select Automation Type'}
              </span>
            </div>
            {currentKeywords.length > 0 && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span className="text-xs">{currentKeywords.length} triggers</span>
              </div>
            )}
          </div>
          {automationType && (
            <div className="mt-2 text-xs text-emerald-100">
              Monitoring: {currentKeywords.join(', ') || 'All comments'}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Add this state in the main component
  const [showCommentScreen, setShowCommentScreen] = useState(false);

  // Add this function in the main component
  const handleAutomationTypeSelect = (type: string) => {
    setSelectedAutomationType(type);
    if (type === 'comment' || type === 'comment_to_dm') {
      setShowCommentScreen(true);
    }
    // Continue to next step logic here
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Sleek Management Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 w-full shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Automation Studio
                </h1>
                <p className="text-sm text-gray-600">Smart social media automation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAutomationList(!showAutomationList)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Manage Automations
            </button>
            <button
              onClick={() => {
                setCurrentStep(1)
                setShowAutomationList(false)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              New Automation
            </button>
          </div>
        </div>
      </div>

      {/* Show automation list or step-by-step flow */}
      {showAutomationList ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <AutomationListManager 
            automationRules={automationRules}
            rulesLoading={rulesLoading}
            updateAutomationMutation={updateAutomationMutation}
            deleteAutomationMutation={deleteAutomationMutation}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6 pb-20">

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center group">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-300 shadow-lg ${
                      currentStep >= step.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white transform scale-110 shadow-blue-200' 
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white transform scale-110 shadow-blue-200'
                        : 'border-gray-300 text-gray-400 bg-white hover:border-gray-400 hover:shadow-md'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center transition-all duration-300">
                      <div className={`text-sm font-semibold ${
                        currentStep >= step.id ? 'text-blue-700' : 'text-gray-700'
                      }`}>{step.title}</div>
                      <div className={`text-xs mt-1 ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                      }`}>{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-6 mt-[-25px] rounded-full transition-all duration-500 ${
                      currentStep > step.id 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                  Step {currentStep} of {steps.length}
                </div>
                
                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    disabled={createAutomationMutation.isPending}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {createAutomationMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Activate Automation
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            {renderInstagramPreview()}
          </div>
        </div>
      </div>
      )}



    </div>
  )
}