import React, { useState } from 'react';
import { format } from "timeago.js";
import { HiDotsVertical } from "react-icons/hi";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BlogListItem = ({ blog }: { blog: BlogPost }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleUpdate = () => {
        redirect(`/write/${blog.slug}`);
        setMenuOpen(false);
    };

    return (
        <div className='relative flex flex-col mb-8 sm:flex-row gap-3'>
            {/* image */}
            {blog?.img && (
                <div className='sm:w-1/2 xl:w-1/3'>
                    {/* <img src={blog?.img} alt={blog?.title} className='rounded-2xl object-cover aspect-video' /> */}
                    <Image src={blog?.img} alt={blog?.title} width={540} height={300} className='rounded-2xl object-cover aspect-video' />
                </div>
            )}

            {/* details & title */}
            <div className='flex flex-col gap-1 sm:w-1/2 xl:w-2/3'>
                {/* title */}
                <Link href={`/blog/${blog?.slug}`} className='text-xl font-semibold'>
                    {blog?.title}
                </Link>

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
                <Link
                    href={`/blog/${blog?.slug}`}
                    className='underline text-sm text-blue-800'
                >
                    Read More
                </Link>
            </div>

            {/* Options menu */}
            {location.pathname === '/my-blogs' && (
                <div className='absolute top-2 right-2'>
                    <button
                        onClick={toggleMenu}
                        className='text-xl font-semibold p-1 hover:bg-gray-400 rounded-full  focus:outline-none'
                    >
                        <HiDotsVertical />
                    </button>
                    {menuOpen && (
                        <div className='absolute right-2 w-32 bg-white shadow-md border rounded-md'>
                            <button
                                onClick={handleUpdate}
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                            >
                                Update
                            </button>
                            <button
                                // onClick={handleDelete} todo
                                className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogListItem;