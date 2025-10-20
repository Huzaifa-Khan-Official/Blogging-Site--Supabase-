'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface SearchProps {
  currentSearch?: string | null;
}

const Search = ({ currentSearch }: SearchProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(currentSearch || '');

  const handleSearch = () => {
    const query = searchQuery.trim();
    const currentUrl = new URL(window.location.href);
    const newParams = new URLSearchParams(currentUrl.search);

    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }

    router.push(`/blogs?${newParams.toString()}`);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className='bg-gray-100 p-2 rounded-full flex items-center gap-2'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="gray"
        className='cursor-pointer'
        onClick={handleSearch}
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>

      <input
        type="text"
        placeholder='Search a post...'
        className='bg-transparent focus:outline-none w-full'
        onKeyDown={handleKeyPress}
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
    </div>
  )
}

export default Search