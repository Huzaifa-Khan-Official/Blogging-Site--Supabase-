import Comment from './Comment'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import CommentSkeleton from './skeletons/CommentSkeleton';
import { getComments, addComment } from '@/actions/comment/actions';

const Comments = ({ blogId }: { blogId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const { data, error } = await getComments(blogId);

            if (data) {
                setComments(data);
                setLoading(false);
            }
        }

        fetchComments();
    }, [])

    const onSubmit = async (data: any) => {
        const { success, error } = await addComment(blogId, data.description);

        if (error) {
            toast.error(error);
        }

        if (success) {
            toast.success("Comment added successfully");
            reset();
        }
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

            {
                loading && [...Array(3)].map((_, i) => (
                    <CommentSkeleton key={i} />
                ))
            }
            {
                comments.length === 0 ? (
                    <p className='text-gray-500'>No comments yet</p>
                ) : comments.map(comment => (
                    <Comment key={comment.id} comment={comment} blogId={blogId} />
                ))
            }
        </div>
    )
}

export default Comments