import React from 'react'
import Image from './Image'
import { format } from 'timeago.js'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';

const Comment = ({ comment, postId }) => {
    const { authUser } = useAuthStore();

    const role = authUser?.role || false;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            try {
                const response = await axiosInstance.delete(`/comments/${comment._id}`);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments', postId],
            });
            toast.success("Comment deleted successfully", {
                autoClose: 1500,
            });
            if (textareaRef.current) {
                textareaRef.current.value = '';
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message, {
                autoClose: 1500,
            });
        }
    });

    return (
        <div className='p-4 bg-slate-50 rounded-xl mb-2'>
            {/* user info */}
            <div className='flex items-center gap-4'>
                {comment.user.img && <Image
                    src={comment.user.img}
                    className='w-10 h-10 rounded-full object-cover'
                    w="40"
                />}

                <span className='font-medium'>{comment.user.username}</span>

                <span className='text-sm text-gray-500'>{format(comment.createdAt)}</span>

                {
                    authUser && ((comment.user.username === authUser.username || comment.user.username === authUser.email) || role === "admin") &&
                    <span className='text-sm text-red-300 hover:text-red-500 cursor-pointer' onClick={() => mutation.mutate()}>
                        Delete
                        {
                            mutation.isPending && <span className='ml-2 text-red-300'>...</span>
                        }
                    </span>
                }
            </div>

            <div className='mt-2'>
                <p>
                    {comment.desc}
                </p>
            </div>
        </div>
    )
}

export default Comment