'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogList from '@/components/BlogList';
import SideMenu from '@/components/SideMenu';
import BlogCardSkeleton from '@/components/skeletons/BlogCardSkeleton';

function PostListContent() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const search = searchParams.get('search');
        const category = searchParams.get('cat');
        const sort = searchParams.get('sort');

        if (search) {
            setTitle(`Search Results for "${search}"`);
        } else if (category) {
            setTitle(`"${category.replace(/-/g, " ")}" Category Blogs`);
        } else if (sort) {
            setTitle(`"${sort.replace(/-/g, " ")}" Blogs`);
        } else {
            setTitle('All Posts');
        }
    }, [searchParams]);

    return (
        <div>
            <h1 className='mt-5 mb-8 text-2xl capitalize'>{title}</h1>
            <button
                onClick={() => setOpen(!open)}
                className='bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden'
            >
                {open ? "Close" : "Filter or Search"}
            </button>
            <div className='flex flex-col-reverse justify-between md:flex-row gap-8'>
                <div className='xl:w-3/4'>
                    <BlogList />
                </div>
                {/* Side Menu */}
                <div className={`${open ? "block" : "hidden"} md:block`}>
                    <SideMenu />
                </div>
            </div>
        </div>
    );
}

const PostListPage = () => {
    return (
        <Suspense fallback={
            <div>
                <h1 className='mt-5 mb-8 text-2xl capitalize'>Loading...</h1>
                <div className='flex flex-col-reverse justify-between md:flex-row gap-8'>
                    <div className='xl:w-3/4'>
                        {[...Array(3)].map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                    <div className='hidden md:block'>
                        <SideMenu />
                    </div>
                </div>
            </div>
        }>
            <PostListContent />
        </Suspense>
    );
}

export default PostListPage;