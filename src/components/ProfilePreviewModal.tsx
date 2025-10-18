"use client"

import type React from "react"
import { format } from 'timeago.js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfilePreviewModalProps {
  user: UserProfile
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ user }) => {
  const email = user.email || "No email"
  const displayName = user?.username || "User"
  const avatarUrl = user.img;

  return (
    <div className="space-y-4 py-4 px-2 sm:px-0">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
          <AvatarImage src={avatarUrl || "/userIcon.jpg"} alt={displayName} />
          <AvatarFallback className="bg-blue-200 text-blue-900 text-lg sm:text-xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center w-full">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{displayName}</h3>
          <p className="text-xs sm:text-sm text-gray-600 break-all">{email}</p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 border-t border-purple-200 pt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Profile Title:</span>
          <span className="text-xs sm:text-sm text-gray-600 break-all text-end">{user.title}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">User ID:</span>
          <span className="text-xs sm:text-sm text-gray-600 break-all">{user.id}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Account Created:</span>
          <span className="text-xs sm:text-sm text-gray-600 break-all">
            {user.created_at ? format(user?.created_at) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  )
}
