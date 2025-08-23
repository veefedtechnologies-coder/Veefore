import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Image, Search } from 'lucide-react'

const recommendations = [
  {
    icon: MapPin,
    title: 'How often to post',
    description: 'Having a consistent, always-on presence on social media is generally your ticket to success, but every network can be slightly different.',
    color: 'text-blue-600'
  },
  {
    icon: Image,
    title: 'Consider image sizes',
    description: 'Visual content drives the most engagement on social, so make sure you get your image sizes right.',
    color: 'text-purple-600'
  },
  {
    icon: Search,
    title: 'Optimize for discoverability',
    description: 'Want your content to show up at the top of people\'s search results on social?',
    color: 'text-green-600'
  }
]

export function Recommendations() {
  return (
    <Card data-testid="recommendations" className="border-gray-200/50 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Your recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start space-x-5 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/50 transition-all duration-300 group cursor-pointer">
            <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white ${rec.color}`}>
              <rec.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-700 transition-colors duration-300">{rec.title}</h4>
              <p className="text-gray-700 leading-relaxed">{rec.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}