import React from 'react'
import Image from './Image';
import { Link } from 'react-router-dom';
import axios from 'axios';
import configuration from '../configuration/config';
import { useQuery } from '@tanstack/react-query';
import { format } from "timeago.js"
import { axiosInstance } from '../lib/axios';

const fetchPost = async () => {
  const response = await axiosInstance.get("/blogs?featured=true&limit=4&sort=newest");
  return response.data;
}

const FeaturedPosts = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ['featuredPost'],
    queryFn: () => fetchPost(),
  });

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const blogs = data.blogs;

  if (!blogs || blogs.length === 0) return (
    <div className=''>
      No Featured Posts found
    </div>
  );

  return (
    <div className='flex flex-col md:flex-row gap-8 py-5'>
      {/* First */}
      <div className='w-full flex md:w-1/2 flex-col gap-3'>
        {/* image */}
        {blogs[0].img && <Image
          src={blogs[0].img}
          className='rounded-3xl object-cover'
          w={703}
        />}

        {/* details */}
        <div className='flex items-center gap-4'>
          <h1 className='font-semibold lg:text-lg'>01.</h1>
          <Link to={`/blogs?cat=${blogs[0].category}`} className='text-blue-800 lg:text-lg'>{blogs[0].category}</Link>
          <span className='text-gray-500'>{format(blogs[0].createdAt)}</span>
        </div>

        {/* title */}
        <Link to={blogs[0].slug} className='text-lg lg:text-3xl font-semibold lg:font-bold'>
          {blogs[0].title}
        </Link>

      </div>

      {/* Others */}
      <div className='w-full md:w-1/2 flex flex-col gap-4'>
        {/* second */}
        {blogs[1] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {blogs[1].img && <Image
              src={blogs[1].img}
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
                <Link to={`/blogs?cat=${blogs[1].category}`} className='text-blue-800'>
                  {blogs[1].category}
                </Link>
                <span className='text-gray-500'>{format(blogs[1].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={blogs[1].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {blogs[1].title}
            </Link>
          </div>
        </div>}

        {/* third */}
        {blogs[2] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {blogs[2].img && <Image
              src={blogs[2].img}
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
                <Link to={`/blogs?cat=${blogs[2].category}`} className='text-blue-800'>
                  {blogs[2].category}
                </Link>
                <span className='text-gray-500'>{format(blogs[2].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={blogs[2].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {blogs[2].title}
            </Link>
          </div>
        </div>}

        {/* fourth */}
        {blogs[3] && <div className='xs:h-1/3 flex flex-col xs:flex-row justify-between gap-4'>
          {/* Image */}
          <div className='xs:w-1/3 aspect-video'>
            {blogs[3].img && <Image
              src={blogs[3].img}
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
                <Link to={`/blogs?cat=${blogs[3].category}`} className='text-blue-800'>
                  {blogs[3].category}
                </Link>
                <span className='text-gray-500'>{format(blogs[3].createdAt)}</span>
              </div>
            </div>

            {/* title */}
            <Link to={blogs[3].slug} className='text-base lg:text-lg xl:text-2xl font-medium'>
              {blogs[3].title}
            </Link>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default FeaturedPosts;