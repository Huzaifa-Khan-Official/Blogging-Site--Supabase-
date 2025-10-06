import React, { useState } from 'react';
import Image from './Image';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from "timeago.js";
import { HiDotsVertical } from "react-icons/hi";
import { usePostStore } from '../store/usePostStore';

const PostListItem = ({ post, onDelete }) => {
    const { deletePost } = usePostStore();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleUpdate = () => {
        navigate(`/write/${post.slug}`);
        setMenuOpen(false);
    };

    const handleDelete = () => {
        deletePost(post._id, () => { });
        setMenuOpen(false);
    };

    return (
        <div className='relative flex flex-col mb-8 sm:flex-row gap-3'>
            {/* image */}
            {post?.img && (
                <div className='sm:w-1/2 xl:w-1/3'>
                    <Image
                        src={post?.img}
                        className='rounded-2xl object-cover aspect-video'
                        w={540}
                    />
                </div>
            )}

            {/* details & title */}
            <div className='flex flex-col gap-1 sm:w-1/2 xl:w-2/3'>
                {/* title */}
                <Link to={`/${post?.slug}`} className='text-xl font-semibold'>
                    {post?.title}
                </Link>

                {/* details */}
                <div className='flex items-center gap-2 text-gray-400 text-sm flex-wrap'>
                    <span>Written by</span>
                    <Link
                        className='text-blue-800'
                        to={`/posts?author=${post?.user.username}`}
                    >
                        {post?.user.username}
                    </Link>
                    <span>on</span>
                    <Link
                        className='text-blue-800'
                        to={`/posts?cat=${post?.category}`}
                    >
                        {post?.category}
                    </Link>
                    <span>{format(post?.createdAt)}</span>
                </div>

                {/* description */}
                <p>{post?.desc}</p>
                <Link
                    to={`/${post?.slug}`}
                    className='underline text-sm text-blue-800'
                >
                    Read More
                </Link>
            </div>

            {/* Options menu */}
            {location.pathname === '/my-posts' && (
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
                                onClick={handleDelete}
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

export default PostListItem;