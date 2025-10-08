import React, { useState } from 'react';
import { format } from "timeago.js";
import { HiDotsVertical } from "react-icons/hi";
import { redirect } from 'next/navigation';
import Link from 'next/link';

const BlogListItem = ({ blog }: {blog: BlogPost}) => {
    // const { deletePost } = usePostStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleUpdate = () => {
        redirect(`/write/${blog.slug}`);
        setMenuOpen(false);
    };

    // const handleDelete = () => {
    //     deletePost(blog.id, () => { });
    //     setMenuOpen(false);
    // };

    console.log("blog ==>", blog);

    return (
        <div className='relative flex flex-col mb-8 sm:flex-row gap-3'>
            {/* image */}
            {blog?.img && (
                <div className='sm:w-1/2 xl:w-1/3'>
                    {/* <Image
                        src={post?.img}
                        className='rounded-2xl object-cover aspect-video'
                        w={540}
                    /> */}

                    <img src={blog?.img} alt={blog?.title} className='rounded-2xl object-cover aspect-video' />
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
                    {/* <Link
                        className='text-blue-800'
                        href={`/blogs?author=${blog?.user.username}`}
                    >
                        {blog?.user.username}
                    </Link> */}
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