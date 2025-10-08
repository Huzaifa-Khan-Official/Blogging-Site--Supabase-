// import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// import React from 'react'

// const Search = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === 'Enter') {
//       const query = event.currentTarget.value;
//       if (pathname === "/blogs") {
//         setSearchParams((prev) => {
//           const newParams = new URLSearchParams(prev.toString());
//           newParams.set('search', query);
//           return newParams;
//         });
//       } else {
//         router.push(`/blogs?search=${encodeURIComponent(query)}`);
//       }
//     }
//   }

//   return (
//     <div className='bg-gray-100 p-2 rounded-full flex items-center gap-2'>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         width="20"
//         height="20"
//         fill="none"
//         stroke="gray"
//       >
//         <circle cx="10.5" cy="10.5" r="7.5" />
//         <line x1="16.5" y1="16.5" x2="22" y2="22" />
//       </svg>

//       <input type="text" placeholder='Search a post...' className='bg-transparent focus:outline-none' onKeyDown={handleKeyPress}/>
//     </div>
//   )
// }

// export default Search



'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = (event.target as HTMLInputElement).value.trim();
      
      if (!query) return;

      // Simple redirect to blogs page with search query
      router.push(`/blogs?search=${encodeURIComponent(query)}`);
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