import React from 'react'
import Image from './Image';
import { Link } from 'react-router-dom';
import axios from 'axios';
import configuration from '../configuration/config';
import { useQuery } from '@tanstack/react-query';
import { format } from "timeago.js"
import { axiosInstance } from '../lib/axios';

const fetchPost = async () => {
  const response = await axiosInstance.get("/posts?featured=true&limit=4&sort=newest");
  return response.data;
}

const FeaturedPosts = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ['featuredPost'],
    queryFn: () => fetchPost(),
  });

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const posts = data.posts;

  if (!posts || posts.length === 0) return (
    <div className=''>
      No Featured Posts found
    </div>
  );

  return (
    <div className='flex flex-col md:flex-row gap-8 py-5'>
      {/* First */}
      <div className='w-full flex md:w-1/2 flex-col gap-3'>
        {/* image */}
        {posts[0].img && <Image
          src={posts[0].img}
          className='rounded-3xl object-cover'
          w={703}
        />}

        {/* details */}
        <div className='flex items-center gap-4'>
          <h1 className='font-semibold lg:text-lg'>01.</h1>
          <Link to={`/posts?cat=${posts[0].category}`} className='text-blue-800 lg:text-lg'>{posts[0].category}</Link>
          <span className='text-gray-500'>{format(posts[0].createdAt)}</span>
        </div>

        {/* title */}
        <Link to={posts[0].slug} className='text-lg lg:text-3xl font-semibold lg:font-bold'>
          {posts[0].title}
        </Link>

      </div>

      {/* Others */}
      <div className='w-full md:w-1/2 flex flex-col gap-4'>
        {/* second */}
        {posts[1] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {posts[1].img && <Image
              src={posts[1].img}
              className='rounded-3xl object-cover w-full h-full max-h-[234px]'
              w={234}
            />}
          </div>

          {/* details and titles */}
          <div className='w-full sm:w-2/3'>
            {/* details */}
            <div className=''>
              <div className='flex items-center gap-2 text-sm lg:text-base mb-4'>
                <h1 className="font-semibold">
                  02.
                </h1>
                <Link to={`/posts?cat=${posts[1].category}`} className='text-blue-800'>
                  {posts[1].category}
                </Link>
                <span className='text-gray-500'>{format(posts[1].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={posts[1].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {posts[1].title}
            </Link>
          </div>
        </div>}

        {/* third */}
        {posts[2] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {posts[2].img && <Image
              src={posts[2].img}
              className='rounded-3xl object-cover w-full h-full max-h-[234px]'
              w={234}
            />}
          </div>

          {/* details and titles */}
          <div className='w-full sm:w-2/3'>
            {/* details */}
            <div className=''>
              <div className='flex items-center gap-2 text-sm lg:text-base mb-4'>
                <h1 className="font-semibold">
                  02.
                </h1>
                <Link to={`/posts?cat=${posts[2].category}`} className='text-blue-800'>
                  {posts[2].category}
                </Link>
                <span className='text-gray-500'>{format(posts[2].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={posts[2].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {posts[2].title}
            </Link>
          </div>
        </div>}

        {/* fourth */}
        {posts[3] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {posts[3].img && <Image
              src={posts[3].img}
              className='rounded-3xl object-cover w-full h-full max-h-[234px]'
              w={234}
            />}
          </div>

          {/* details and titles */}
          <div className='w-full sm:w-2/3'>
            {/* details */}
            <div className=''>
              <div className='flex items-center gap-2 text-sm lg:text-base mb-4'>
                <h1 className="font-semibold">
                  02.
                </h1>
                <Link to={`/posts?cat=${posts[3].category}`} className='text-blue-800'>
                  {posts[3].category}
                </Link>
                <span className='text-gray-500'>{format(posts[3].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={posts[3].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {posts[3].title}
            </Link>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default FeaturedPosts;