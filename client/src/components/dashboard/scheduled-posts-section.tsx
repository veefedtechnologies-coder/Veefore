import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ScheduledPostsSection() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Scheduled posts</h3>
            <p className="text-sm text-gray-500">Created in Hootsuite</p>
          </div>
          <Button variant="outline" size="sm" className="text-sm text-gray-600">
            View all scheduled
          </Button>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="text-gray-500 mb-6 text-base">No scheduled posts</div>
          
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium">
            Create a post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}