"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateComment, deleteComment } from "@/actions/comment/actions"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-toastify"
import { format } from "timeago.js"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs"
import Image from "next/image"

interface CommentProps {
    comment: Comment
    onCommentUpdated?: (updatedComment: any) => void
    onCommentDeleted?: (commentId: string) => void
    isDeleting: boolean
}

export default function Comment({
    comment,
    onCommentUpdated,
    onCommentDeleted,
}: CommentProps) {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.description)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const isAdmin = user?.role === 'admin';
    const isOwner = user?.id === comment.user_id;
    const canEdit = isAdmin || isOwner;

    const handleUpdate = async () => {
        if (!editedContent.trim()) {
            toast.error("Comment cannot be empty")
            return
        }

        if (editedContent === comment.description) {
            setIsEditing(false)
            return
        }

        setIsUpdating(true)
        try {
            const { data, error } = await updateComment(comment.id, editedContent, user?.id || "")

            if (error) {
                toast.error(error)
                return
            }

            toast.success("Comment updated successfully")
            setIsEditing(false)

            if (onCommentUpdated && data) {
                onCommentUpdated(data[0])
            }
        } catch (err) {
            toast.error("Failed to update comment")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this comment?")) return

        setIsDeleting(true)
        try {
            const { error } = await deleteComment(comment.id)

            if (error) {
                toast.error(error)
                return
            }

            toast.success("Comment deleted successfully")

            if (onCommentDeleted) {
                onCommentDeleted(comment.id)
            }
        } catch (err) {
            toast.error("Failed to delete comment")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCancel = () => {
        setEditedContent(comment.description)
        setIsEditing(false)
    }

    console.log("comment ==>", comment)

    return (
        <div className="border rounded-lg p-4 mb-4 bg-white">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className='flex gap-2 items-center'>
                        <Image
                            src={comment.author?.img || "/userIcon.jpg"}
                            className='w-9 h-9 rounded-full object-cover'
                            width="36"
                            height="36"
                            alt="User Image"
                        />
                        <div>

                        <span className='font-medium'>{comment.author?.username}</span>
                        <p className="text-sm text-gray-500">
                            {format(comment.created_at)}
                        </p>
                        </div>
                    </div>
                </div>
                {
                    canEdit && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className='cursor-pointer'><BsThreeDotsVertical /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>Update</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete()}>
                                    <span className='text-sm text-red-500 hover:text-red-400 cursor-pointer'>
                                        Delete
                                        {
                                            isDeleting && <span className='ml-2 text-red-300'>...</span>
                                        }
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Edit your comment..."
                        className="min-h-24"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700">
                            {isUpdating ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{comment.description}</p>
            )}
        </div>
    )
}
