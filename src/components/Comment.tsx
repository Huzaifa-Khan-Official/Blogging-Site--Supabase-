import { format } from 'timeago.js'
import { toast } from 'react-toastify';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { deleteComment } from '@/actions/comment/actions';

const Comment = ({ comment, blogId }: { comment: Comment, blogId: string }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    // const { authUser } = useAuthStore();

    // const role = authUser?.role || false;

    // const queryClient = useQueryClient();

    // const mutation = useMutation({
    //     mutationFn: async () => {
    //         try {
    //             const response = await axiosInstance.delete(`/comments/${comment._id}`);
    //             return response.data;
    //         } catch (error) {
    //             throw error;
    //         }
    //     },
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({
    //             queryKey: ['comments', postId],
    //         });
    //         toast.success("Comment deleted successfully", {
    //             autoClose: 1500,
    //         });
    //         if (textareaRef.current) {
    //             textareaRef.current.value = '';
    //         }
    //     },
    //     onError: (error) => {
    //         toast.error(error.response.data.message, {
    //             autoClose: 1500,
    //         });
    //     }
    // });

    const handleDelete = async (commentId: string) => {
        setIsDeleting(true);
        const { success, error } = await deleteComment(commentId);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success("Comment deleted successfully");
        }
        setIsDeleting(false);
    }

    return (
        <div className='p-4 !bg-slate-50 rounded-xl mb-2'>
            {/* user info */}
            <div className='flex items-center justify-between gap-4'>
                {/* todo {comment.user.img && <Image
                    src={comment.user.img}
                    className='w-10 h-10 rounded-full object-cover'
                    w="40"
                />} */}

                {/* <span className='font-medium'>{comment.user.username}</span> todo */}

                <span className='text-sm text-gray-500'>{format(comment.created_at)}</span>

                {/* { todo
                    authUser && ((comment.user.username === authUser.username || comment.user.username === authUser.email) || role === "admin") &&
                    <span className='text-sm text-red-300 hover:text-red-500 cursor-pointer' onClick={() => mutation.mutate()}>
                        Delete
                        {
                            mutation.isPending && <span className='ml-2 text-red-300'>...</span>
                        }
                    </span>
                } */}
                
                <DropdownMenu>
                    <DropdownMenuTrigger className='cursor-pointer'><BsThreeDotsVertical /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(comment.id)}>
                            <span className='text-sm text-red-500 hover:text-red-400 cursor-pointer'>
                                Delete
                                {
                                    isDeleting && <span className='ml-2 text-red-300'>...</span>
                                }
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='mt-2'>
                <p>
                    {comment.description}
                </p>
            </div>
        </div>
    )
}

export default Comment