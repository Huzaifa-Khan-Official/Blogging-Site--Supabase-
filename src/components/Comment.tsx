import { format } from 'timeago.js'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const Comment = ({ comment, handleDelete, isDeleting }: { comment: Comment, handleDelete: (commentId: string) => void, isDeleting: boolean }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isOwner = user?.id === comment.id;
    const canEdit = isAdmin || isOwner;

    return (
        <div className='p-4 !bg-slate-50 rounded-xl mb-2'>
            {/* user info */}
            <div className='flex items-center justify-between gap-4'>
                <div className='flex gap-2 items-center'>
                    <Image
                        src={comment.author?.img || "/userIcon.jpg"}
                        className='w-9 h-9 rounded-full object-cover'
                        width="36"
                        height="36"
                        alt="User Image"
                    />
                    <span className='font-medium'>{comment.author?.username}</span>
                </div>

                <div className='flex gap-2 items-center'>
                    <span className='text-sm text-gray-500'>{format(comment.created_at)}</span>

                    {/* { todo
                    authUser && ((comment.user.username === authUser.username || comment.user.username === authUser.email) || role === "admin") &&
                    <span className='text-sm text-red-300 hover:text-red-500 cursor-pointer' onClick={() => mutation.mutate()}>
                        Update
                        {
                            mutation.isPending && <span className='ml-2 text-red-300'>...</span>
                        }
                    </span>
                } */}
                    {
                        canEdit && (
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
                        )
                    }
                </div>
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