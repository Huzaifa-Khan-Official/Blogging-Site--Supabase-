"use client"

import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import CommentSkeleton from "./skeletons/CommentSkeleton"
import { getComments, addComment, deleteComment } from "@/actions/comment/actions"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/context/AuthContext"
import Comment from "./Comment"

const Comments = ({ blogId }: { blogId: string }) => {
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const [isDeleting, setIsDeleting] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm()

    useEffect(() => {
        fetchComments()
    }, [blogId])

    useEffect(() => {
        const supabase = createClient()
        const channel = supabase
            .channel(`comments-${blogId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "Comments",
                    filter: `blog_id=eq.${blogId}`,
                },
                (payload) => {
                    setComments((prev) => [...prev, payload.new])
                },
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "Comments",
                    filter: `blog_id=eq.${blogId}`,
                },
                (payload) => {
                    setComments((prev) => prev.map((comment) => (comment.id === payload.new.id ? payload.new : comment)))
                },
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [blogId])

    const fetchComments = async () => {
        setLoading(true)
        const { data, error } = await getComments(blogId)
        if (data) {
            setComments(data)
        }
        setLoading(false)
    }

    const fetchUpdatedComments = async () => {
        const { data, error } = await getComments(blogId)
        if (data) {
            setComments(data)
        }
    }

    const onSubmit = async (data: any) => {
        if (!user) {
            toast.error("You must be logged in to comment")
            return
        }
        const { success, error } = await addComment(blogId, data.description)
        if (error) {
            toast.error(error)
        }
        if (success) {
            toast.success("Comment added successfully")
            reset()
        }
    }

    const handleDelete = async (commentId: string) => {
        setIsDeleting(true)
        fetchUpdatedComments()
        setIsDeleting(false)
    }

    return (
        <div className="space-y-6 lg:w-3/5">
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex gap-2 items-start">
                <textarea
                    {...register("description", {
                        required: {
                            value: true,
                            message: "Comment is required",
                        },
                    })}
                    placeholder="Write a comment..."
                    className="w-full p-4 rounded-xl bg-gray-50"
                />
                <button type="submit" className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl cursor-pointer">
                    Send
                </button>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <CommentSkeleton key={i} />
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} isDeleting={isDeleting} onCommentDeleted={handleDelete} onCommentUpdated={fetchUpdatedComments} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comments
