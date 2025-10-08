import React, { useRef } from 'react'
import Comment from './Comment'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form';

// const fetchComments = async (blogId: string) => {
//     const res = await axiosInstance.get(`/comments/${blogId}`);
//     return res.data;
// }

const Comments = ({ blogId }: { blogId: string }) => {
    const textareaRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // const { isPending, error, data } = useQuery({
    //     queryKey: ['comments', postId],
    //     queryFn: () => fetchComments(postId),
    // });

    // const queryClient = useQueryClient();

    // const mutation = useMutation({
    //     mutationFn: async (newComment) => {
    //         try {
    //             const response = await axiosInstance.post(`/comments/${postId}`, newComment);
    //             return response.data;
    //         } catch (error) {
    //             throw error;
    //         }
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({
    //             queryKey: ['comments', postId],
    //         });
    //         if (textareaRef.current) {
    //             textareaRef.current.value = '';
    //         }
    //     },
    //     onError: (error) => {
    //         toast.error(error.response.data.message);
    //     }
    // });

    // if (isPending) return <div>Loading...</div>
    // if (error) return <div>Error: {error.message}</div>

    const onSubmit = (data: any) => {
        // mutation.mutate(data);
    }
    return (
        <div className='flex flex-col gap-6 lg:w-3/5'>
            <h1 className='text-xl text-gray-500 underline'>Comments</h1>

            {/* input container */}
            <form onSubmit={handleSubmit(onSubmit)} className='flex items-center justify-between gap-8 w-full'>
                <textarea
                    {...register("description", {
                        required: {
                            value: true,
                            message: "Comment is required",
                        },
                    })} placeholder='Write a comment...' className='w-full p-4 rounded-xl bg-gray-50'
                />
                <button type='submit' className='bg-blue-800 px-4 py-3 text-white font-medium rounded-xl'>Send</button>
            </form>
            {errors.description && errors.description?.message && (
                <p className="text-red-500">{String(errors.description.message)}</p>
            )}

            {/* single comment */}
            {/* {isPending ? (
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
                            <Comment key={comment._id} comment={comment} blogId={blogId} />
                        ))
                    }
                </>
            )
            } */}
        </div>
    )
}

export default Comments