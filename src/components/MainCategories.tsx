import React from 'react'
import Search from './Search';
import Link from 'next/link';

const MainCategories = () => {
    return (
        <div className='hidden md:flex bg-white rounded-3xl xl:rounded-full p-4  shadow-lg items-center justify-center gap-8'>
            {/* links */}
            <div className='flex-1 flex items-center gap-1 flex-wrap'>
                <Link
                    href="/blogs"
                    className="bg-blue-800 text-white rounded-full px-4 py-2"
                >
                    All Posts
                </Link>
                <Link
                    href="/blogs?cat=web-design"
                    className="hover:bg-blue-100 rounded-full px-4 py-2"
                >
                    Web Design
                </Link>
                <Link
                    href="/blogs?cat=development"
                    className="hover:bg-blue-100 rounded-full px-4 py-2"
                >
                    Development
                </Link>
                <Link
                    href="/blogs?cat=databases"
                    className="hover:bg-blue-100 rounded-full px-4 py-2"
                >
                    Databases
                </Link>
                <Link
                    href="/blogs?cat=seo"
                    className="hover:bg-blue-100 rounded-full px-4 py-2"
                >
                    Search Engines
                </Link>
                <Link
                    href="/blogs?cat=marketing"
                    className="hover:bg-blue-100 rounded-full px-4 py-2"
                >
                    Marketing
                </Link>

            </div>

            {/* separator */}
            <span className='text-xl font-medium'>|</span>

            {/* search */}
            <Search />
        </div>
    )
}

export default MainCategories;