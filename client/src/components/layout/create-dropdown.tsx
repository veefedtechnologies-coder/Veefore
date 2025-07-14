import React from 'react'
import { Edit3, Sparkles, MessageSquareText, Megaphone, Rocket, Link, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateDropdownProps {
  isOpen: boolean
  onClose: () => void
  onOptionSelect: (option: string) => void
}

const createOptions = [
  {
    icon: Edit3,
    label: 'Post',
    description: 'Create a new social media post',
    action: 'post',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    icon: Sparkles,
    label: 'Content with AI',
    description: 'Generate content using AI assistance',
    action: 'ai-content',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    icon: MessageSquareText,
    label: 'DM automation',
    description: 'Set up automated direct messages',
    action: 'dm-automation',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100'
  },
  {
    icon: Megaphone,
    label: 'Ad',
    description: 'Create advertising campaigns',
    action: 'ad',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    hasSubmenu: true
  },
  {
    icon: Rocket,
    label: 'Automated boost',
    description: 'Boost your content automatically',
    action: 'automated-boost',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    badge: 'New',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    hasSubmenu: true
  },
  {
    icon: Link,
    label: 'Hootbio',
    description: 'Create bio link pages',
    action: 'hootbio',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100',
    badge: 'Upgrade',
    badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-600'
  }
]

export function CreateDropdown({ isOpen, onClose, onOptionSelect }: CreateDropdownProps) {
  console.log('CreateDropdown rendered, isOpen:', isOpen)
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        className="fixed left-28 top-40 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden create-dropdown" 
        style={{ 
          background: 'white',
          border: '2px solid #e5e7eb'
        }}
      >
        {/* Options */}
        <div className="py-2">
          {createOptions.map((option, index) => (
            <div key={option.action}>
              <button
                onClick={() => onOptionSelect(option.action)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 transition-all duration-300 group",
                  option.hoverColor,
                  "hover:shadow-sm"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                  option.bgColor,
                  "group-hover:scale-105 group-hover:shadow-lg"
                )}>
                  <option.icon className={cn("w-4 h-4", option.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900 text-sm">{option.label}</span>
                    {option.badge && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-lg",
                        option.badgeColor
                      )}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
                </div>

                {/* Arrow for submenu */}
                {option.hasSubmenu && (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                )}
              </button>


            </div>
          ))}
        </div>


      </div>
    </>
  )
}