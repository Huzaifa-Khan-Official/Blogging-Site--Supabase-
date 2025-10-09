"use client"

import MainCategories from '../components/MainCategories'
import FeaturedPosts from '../components/FeaturedPosts'
import Link from 'next/link'
import IntroductionSection from '@/components/IntroductionSection'
import BlogList from '@/components/BlogList'

const Home = () => {
  // const {user} = useUser()

  return (
    <div className='mt-4 flex flex-col gap-4'>
      {/* Breadcrumb */}
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <span>•</span>
        <span className='text-blue-800'>Blogs and Articles</span>
      </div>

      {/* Introduction */}
      <IntroductionSection />

      {/* categories */}
      {/* <MainCategories /> */}

      {/* featured blogs */}
      <div className=''>
        <h1 className="mt-3 text-2xl text-gray-600">Feature Blogs</h1>
        {/* <FeaturedPosts /> */}
      </div>

      {/* post list */}
      <div className='pb-8'>
        <h1 className="my-8 text-2xl text-gray-600">Recent Blogs</h1>
        <BlogList />
      </div>
    </div>
  )
}

export default Home