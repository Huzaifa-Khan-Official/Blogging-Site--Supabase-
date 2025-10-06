import React, { useRef } from 'react'
import Comment from './Comment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuthStore } from '../store/useAuthStore'
import { axiosInstance } from '../lib/axios'

const fetchComments = async (postId) => {
    const res = await axiosInstance.get(`/comments/${postId}`);
    return res.data;
}

const Comments = ({ postId }) => {
    const { authUser } = useAuthStore();
    const textareaRef = useRef(null);

    const { isPending, error, data } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchComments(postId),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newComment) => {
            try {
                const response = await axiosInstance.post(`/comments/${postId}`, newComment);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments', postId],
            });
            if (textareaRef.current) {
                textareaRef.current.value = '';
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        }
    });

    if (isPending) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!authUser) {
            toast.error("You need to be logged in to comment", {
                autoClose: 1500,
            });
            e.target.elements.desc.value = "";
            return;
        }

        const formData = new FormData(e.target);

        const data = {
            desc: formData.get('desc'),
        }

        mutation.mutate(data);
    }
    
    return (
        <div className='flex flex-col gap-6 lg:w-3/5'>
            <h1 className='text-xl text-gray-500 underline'>Comments</h1>

            {/* input container */}
            <form onSubmit={handleSubmit} className='flex items-center justify-between gap-8 w-full'>
                <textarea ref={textareaRef} placeholder='Write a comment...' className='w-full p-4  rounded-xl' name='desc' />
                <button type='submit' className='bg-blue-800 px-4 py-3 text-white font-medium rounded-xl'>Send</button>
            </form>

            {/* single comment */}
            {isPending ? (
                "Loading..."
            ) : error ? (
                "Error Loading comments"
            ) : (
                <>
                    {
                        mutation.isPending && (
                            <Comment
                                comment={{
                                    desc: `${mutation.variables.desc} (Sending...)`,
                                    createdAt: new Date(),
                                    user: {
                                        img: authUser.imageUrl,
                                        username: authUser.username
                                    }
                                }}
                            />
                        )
                    }

                    {
                        data.map(comment => (
                            <Comment key={comment._id} comment={comment} postId={postId} />
                        ))
                    }
                </>
            )
            }
        </div>
    )
}

export default Comments