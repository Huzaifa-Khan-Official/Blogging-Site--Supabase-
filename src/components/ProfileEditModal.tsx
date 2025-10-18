"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { uploadFile } from "@/actions/write/actions"
import { updateProfile } from "@/actions/login/actions"

interface ProfileEditModalProps {
    user: UserProfile
    onClose: () => void
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onClose }) => {
    const [fullName, setFullName] = useState<string>(user.username || "")
    const [title, setTitle] = useState<string>(user.title || "")
    const [avatarUrl, setAvatarUrl] = useState<string>(user.img || "")
    const [previewUrl, setPreviewUrl] = useState<string>(user.img || "")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file")
                return
            }

            if (file.size > 1 * 1024 * 1024) {
                toast.error("Image size must be less than 1MB")
                return
            }

            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateProfile = async (): Promise<void> => {
        if (!fullName.trim()) {
            toast.error("Please enter a name")
            return
        }

        setLoading(true)
        let newAvatarUrl = avatarUrl

        if (selectedFile) {
            const uploaded = await uploadFile(selectedFile)
            console.log("uploaded", uploaded)
            if (uploaded) {
                newAvatarUrl = uploaded
            } else {
                toast.error("Failed to upload image")
            }
        }

        const { error } = await updateProfile({
            imgUrl: newAvatarUrl,
            username: fullName,
            title,
        })

        if (error) {
            toast.error(`Error updating profile: ${error}`)
        } else {
            toast.success("Profile updated successfully!")
            setSelectedFile(null)
            setAvatarUrl(newAvatarUrl)
            onClose()
        }
    }

    const displayName = fullName || "User"

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Profile Picture</Label>
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={previewUrl || "/userIcon.jpg"} alt={displayName} />
                        <AvatarFallback className="bg-blue-200 text-blue-900 text-lg">
                            {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={loading}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                </Label>
                <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-medium">
                    Title
                </Label>
                <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your full name"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-100 border-gray-300 text-gray-600"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
                <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={loading}
                    className="flex-1 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}
