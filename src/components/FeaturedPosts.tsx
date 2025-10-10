import { getFeaturedPosts } from '@/actions/write/actions';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { format } from "timeago.js"
import { FeaturedPostsSkeleton } from './skeletons/FeaturedPostsSkeleton';

const FeaturedPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      const { data, error } = await getFeaturedPosts();

      if (data) {
        setFeaturedPosts(data);
      }
      setIsLoading(false);
    }

    fetchFeaturedPosts();
  }, [])

  if (isLoading) return <FeaturedPostsSkeleton />

  const blogs = featuredPosts;

  if (!blogs || blogs.length === 0) return (
    <div className='text-center py-10 text-gray-500'>
      No Featured Posts found
    </div>
  );

  const [first, ...rest] = blogs;

  return (
    <section className="py-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Large featured */}
        <article className="flex flex-col gap-3">
          {first.img ? (
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={first.img || "/placeholder.svg"}
                alt={first.title}
                width={703}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                priority
              />
            </div>
          ) : null}

          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-foreground/80">01.</span>
            <Link
              href={`/blogs?cat=${first.category}`}
              className="font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              {first.category}
            </Link>
            <span className="text-muted-foreground">{format(first.created_at)}</span>
          </div>

          <Link
            href={`/blog/${first.slug}`}
            className="line-clamp-2 text-2xl font-bold leading-snug transition-colors hover:text-blue-700 md:text-3xl"
          >
            {first.title}
          </Link>
        </article>

        {/* Right: Stacked compact cards */}
        <div className="flex flex-col gap-6">
          {rest.slice(0, 3).map((blog, idx) => (
            <article
              key={blog.id}
              className="group flex items-start gap-4 rounded-2xl p-2 transition-colors hover:bg-secondary/50"
            >
              <div className="w-[140px] shrink-0 overflow-hidden rounded-2xl md:w-[180px]">
                {blog.img ? (
                  <Image
                    src={blog.img || "/placeholder.svg"}
                    alt={blog.title}
                    width={234}
                    height={156}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground/80">0{idx + 2}.</span>
                  <Link
                    href={`/blogs?cat=${blog.category}`}
                    className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {blog.category}
                  </Link>
                  <span className="text-muted-foreground">{format(blog.created_at)}</span>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="line-clamp-2 text-lg font-semibold leading-snug transition-colors group-hover:text-blue-700"
                >
                  {blog.title}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPosts;