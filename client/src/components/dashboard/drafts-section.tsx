import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DraftsSection() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
            <p className="text-sm text-gray-500">Created in Hootsuite</p>
          </div>
          <Button variant="outline" size="sm" className="text-sm text-gray-600">
            View all drafts
          </Button>
        </div>

        {/* Content */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            Start drafting content to edit and publish whenever you'd like.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium">
              Create a draft
            </Button>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium">
              Draft post with AI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}