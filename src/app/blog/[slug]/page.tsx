"use client"

// import { useQuery } from '@tanstack/react-query'
import { format } from 'timeago.js'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostMenuActions from '@/components/PostMenuActions';
import { getBlog } from '../../../../actions/write/actions';
import Image from 'next/image';
import Search from '@/components/Search';
import SinglePostSkeleton from '@/components/SinglePostSkeleton';
import Comments from '@/components/Comments';

const SinglePostPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<BlogPost | null>(null);

    useEffect(() => {
        setLoading(true);
        const fetchPost = async () => {
            const { data, error } = await getBlog(slug);

            if (error) {
                toast.error(error);
            } else {
                setData(Array.isArray(data) ? data[0] ?? null : data ?? null);
                setLoading(false);
            }
        }

        fetchPost();
    }, [slug]);


    if (loading) return <SinglePostSkeleton />
    if (!data) return <div>Post Not Found</div>

    return (
        <div className='my-8 flex flex-col gap-8'>
            {/* details */}
            <div className='flex gap-8'>
                {/* details & title */}
                <div className='md:w-3/5 flex flex-col gap-8'>
                    {/* title */}
                    <h1 className='text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>
                        {data.title}
                    </h1>

                    {/* details */}
                    <div className='flex items-center gap-2 text-gray-400 text-sm'>
                        <span>Written by</span>
                        {/* <Link className='text-blue-800'> todo
                            {data?.user?.username}
                        </Link> */}
                        <span>on</span>
                        <Link href={`/category/${data?.category}`} className='text-blue-800'>
                            {data?.category}
                        </Link>
                        <span>{format(data?.created_at)}</span>
                    </div>

                    {/* description */}
                    <p className='text-gray-500 font-medium'>
                        {data?.description}
                    </p>

                </div>

                {/* Image */}
                {
                    data?.img && (
                        <div className='hidden md:flex w-2/5 items-center xl:items-start'>
                            <Image
                                src={data?.img}
                                className='rounded-2xl'
                                width={600}
                                height={600}
                                alt={data?.title}
                            />
                        </div>
                    )
                }
            </div>

            {/* content */}
            <div className='flex flex-col md:flex-row gap-8'>
                {/* text */}
                <div className='lg:text-lg flex flex-col gap-6 text-justify lg:w-4/5 blogContent' dangerouslySetInnerHTML={{ __html: data.content }}></div>

                {/* menu */}
                <div className='px-4 h-max sticky top-4'>
                    <h1 className='mt-2 mb-2 text-sm'>Author</h1>

                    {/* author details */}
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-6'>
                            {/* {data.user.img ? <Image
                                src={data.user.img}
                                className='w-12 h-12 rounded-full object-cover'
                                w="48"
                                h="48"
                            /> :
                                <Image
                                    src="user.png"
                                    className='w-12 h-12 rounded-full object-cover'
                                    w="48"
                                    h="48"
                                />
                            }

                            <Link className='text-blue-800'>
                                {data?.user?.username}
                            </Link> */}
                        </div>

                        {/* <p className=' text-sm text-gray-500'>{data.user.title ? data.user.title : "Lorem ipsum, dolor sit amet consectetur adipisicing elit."}</p> */}

                        <div className='flex gap-2'>
                            {/* <Link>
                                <Image
                                    src="facebook.svg"
                                />
                            </Link>
                            <Link>
                                <Image
                                    src="instagram.svg"
                                />
                            </Link> */}
                        </div>
                    </div>

                    <PostMenuActions blog={data} />

                    <h1 className='mt-4 mb-2 text-sm'>Categories</h1>

                    <div className='flex flex-col gap-2 text-sm'>
                        <Link className='underline' href="/">All</Link>

                        <Link className='underline' href="/blogs?cat=web-design">Web Design</Link>
                        <Link className='underline' href="/blogs?cat=development">Development</Link>
                        <Link className='underline' href="/blogs?cat=databases">Databases</Link>
                        <Link className='underline' href="/blogs?cat=seo">Search Engines</Link>
                        <Link className='underline' href="/blogs?cat=marketing">Marketing</Link>
                    </div>

                    <h1 className='mt-4 mb-2 text-sm'>Search</h1>
                    <Search />
                </div>
            </div>

            <Comments blogId={data.id} />
        </div>
    )
}

export default SinglePostPage