"use client";

import { getAllSavedBlogs } from "@/actions/blogs/actions";
import BlogListItem from "@/components/BlogListItem";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SavedBlogs = () => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      const { blogs, message, success } = await getAllSavedBlogs();

      if (!success) {
        toast.error(message);
      } else {
        setData(
          // @ts-expect-error - API response type needs proper interface
          (blogs ?? []).map((blog: BlogPost & { author?: { id?: string } }) => ({
            ...blog,
            user_id: blog.author?.id ?? null,
          }))
        );
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 mt-8">
        {[...Array(3)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <div>
      <h1 className='mt-5 mb-8 text-2xl'>Saved Blog&apos;s</h1>

      {
        data.length === 0 && (
          <p className="text-center mb-6">No blogs found.</p>
        )
      }

      {data.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default SavedBlogs;