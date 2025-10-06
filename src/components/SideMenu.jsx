import React from 'react'
import Search from './Search'
import { Link, useSearchParams } from 'react-router-dom'

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

    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (e) => {
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            sort: e.target.value,
        });
    }

    const handleCategoryChange = (category) => {
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            cat: category,
        });
    }

    return (
        <div className='px-4 h-max sticky top-6'>
            <h1 className='mb-4 text-sm font-medium'>Search</h1>
            <Search />

            <h1 className='mt-6 mb-4 text-sm font-medium'>Filter</h1>
            <div className='flex flex-col gap-2 text-sm'>
                {
                    filterItems.map(item => (
                        <label key={item.value} className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type="radio"
                                name='sort'
                                value={item.value}
                                className='appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800'
                                onChange={handleFilterChange}
                            />
                            {item.label}
                        </label>
                    ))
                }
            </div>

            <h1 className='mt-6 mb-4 text-sm font-medium'>Categories</h1>
            <div className='flex flex-col gap-2 text-sm'>
                <Link className='underline' to="/posts">All</Link>
                {
                    categoryItems.map(item => (
                        <span key={item.value} className='underline cursor-pointer' onClick={() => handleCategoryChange(item.value)}>
                            {item.label}
                        </span>
                    ))
                }
            </div>
        </div>
    )
}

export default SideMenu