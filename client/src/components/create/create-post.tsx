import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X, Image, Video, Calendar, ChevronDown, Paperclip, AtSign, Hash, Smile, MapPin, Clock } from 'lucide-react'

export function CreatePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram'])
  const [postContent, setPostContent] = useState('')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a post</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Post Creation */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Publish to</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a social account (required)</option>
                </select>
                
                <div className="text-sm font-medium text-gray-700">Recently used:</div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">IG</span>
                  </div>
                  <span className="font-medium text-gray-900">@username</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-900">Your post</CardTitle>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  <span className="mr-2">✨</span>
                  Enhance with VeeGPT AI
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Write your caption, then customize it for each social network"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <AtSign className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Hash className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MapPin className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{postContent.length}</span>
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-purple-600">AI</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                Save as draft
              </Button>
              <Button variant="outline" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Schedule for later
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button className="bg-slate-700 hover:bg-slate-800 px-6">
              Post now
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Your account</CardTitle>
              <p className="text-sm text-gray-600">Today</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Write your caption, then customize it for each social network
              </p>
              
              {/* Instagram Preview */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">username</div>
                  </div>
                </div>
                
                {/* Post Image Placeholder */}
                <div className="w-full h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Image className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Add an image or video</p>
                  </div>
                </div>
                
                {/* Engagement Icons */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="p-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="p-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="icon" className="p-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="p-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </Button>
                </div>
                
                {/* Caption */}
                <div className="text-sm">
                  <span className="font-medium">username</span>
                  {postContent && (
                    <span className="ml-2">{postContent}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}