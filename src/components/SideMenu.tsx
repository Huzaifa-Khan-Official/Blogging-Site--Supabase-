'use client';

import React from 'react';
import Search from './Search';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const filterItems = [
    {
        value: "newest",
        label: "Newest"
    },
    {
        value: "popular",
        label: "Most Popular"
    },
    {
        value: "trending",
        label: "Trending"
    },
    {
        value: "oldest",
        label: "Oldest"
    },
];

const categoryItems = [
    {
        value: "web-design",
        label: "Web Design"
    },
    {
        value: "development",
        label: "Development"
    },
    {
        value: "databases",
        label: "Databases"
    },
    {
        value: "seo",
        label: "Search Engines"
    },
    {
        value: "marketing",
        label: "Marketing"
    },
]

const SideMenu = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('sort', e.target.value);

        router.push(`/blogs?${newParams.toString()}`);
    }

    const handleCategoryChange = (category: string) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (category) {
            newParams.set('cat', category);
        } else {
            newParams.delete('cat');
        }

        router.push(`/blogs?${newParams.toString()}`);
    }

    const currentSort = searchParams.get('sort') || 'newest';
    const currentCategory = searchParams.get('cat');

    return (
        <div className='px-4 h-max sticky top-6 pb-6'>
            <h1 className='mb-4 text-sm font-medium'>Search</h1>
            <Search />

            <h1 className='mt-6 mb-4 text-sm font-medium'>Filter</h1>
            <div className='flex flex-col gap-2 text-sm'>
                {filterItems.map(item => (
                    <label key={item.value} className='flex items-center gap-2 cursor-pointer'>
                        <input
                            type="radio"
                            name='sort'
                            value={item.value}
                            checked={currentSort === item.value}
                            className='appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800'
                            onChange={handleFilterChange}
                        />
                        {item.label}
                    </label>
                ))}
            </div>

            <h1 className='mt-6 mb-4 text-sm font-medium'>Categories</h1>
            <div className='flex flex-col gap-2 text-sm'>
                <Link
                    className={`underline ${!currentCategory ? 'text-blue-600 font-medium' : ''}`}
                    href="/blogs"
                >
                    All
                </Link>
                {categoryItems.map(item => (
                    <span
                        key={item.value}
                        className={`underline cursor-pointer ${currentCategory === item.value ? 'text-blue-600 font-medium' : ''}`}
                        onClick={() => handleCategoryChange(item.value)}
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default SideMenu;