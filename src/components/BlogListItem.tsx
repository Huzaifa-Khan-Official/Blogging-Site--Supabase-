import React, { useState } from 'react';
import { format } from "timeago.js";
import Link from 'next/link';
import Image from 'next/image';
import BlogLink from './BlogLink';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { deleteBlog } from '@/actions/write/actions';

const BlogListItem = ({ blog }: { blog: BlogPost }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async (blogid: string) => {
        setIsDeleting(true);
        const { success, error } = await deleteBlog(blogid);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success("Blog deleted successfully");
        }
        setIsDeleting(false);
    }

    return (
        <div className='relative flex flex-col mb-8 sm:flex-row gap-3'>
            {/* image */}
            {blog?.img && (
                <div className='sm:w-1/2 xl:w-1/3'>
                    <Image src={blog?.img} alt={blog?.title} width={540} height={300} className='rounded-2xl object-cover aspect-video' />
                </div>
            )}

            {/* details & title */}
            <div className='flex flex-col gap-1 sm:w-1/2 xl:w-2/3'>
                {/* title */}
                <BlogLink slug={blog.slug} className="text-xl font-semibold">
                    {blog.title}
                </BlogLink>

                {/* details */}
                <div className='flex items-center gap-2 text-gray-400 text-sm flex-wrap'>
                    <span>Written by</span>
                    <Link
                        className='text-blue-800'
                        href={`/blogs?author=${blog?.author?.username}`}
                    >
                        {blog?.author?.username}
                    </Link>
                    <span>on</span>
                    <Link
                        className='text-blue-800'
                        href={`/blogs?cat=${blog?.category}`}
                    >
                        {blog?.category}
                    </Link>
                    <span>{format(blog?.created_at)}</span>
                </div>

                {/* description */}
                <p>{blog?.description}</p>
                <BlogLink slug={blog.slug} className="underline text-sm text-blue-800">
                    Read More
                </BlogLink>
            </div>

            {/* Options menu */}
            {location.pathname === '/my-blogs' && (
                <div className='absolute top-2 right-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer'><BsThreeDotsVertical /></DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Link href={`/write/${blog.slug}`} className='w-full'>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(blog.id)} className='cursor-pointer'>
                                <span className='text-sm text-red-500 hover:text-red-400'>
                                    Delete
                                    {
                                        isDeleting && <span className='ml-2 text-red-300'>...</span>
                                    }
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default BlogListItem;