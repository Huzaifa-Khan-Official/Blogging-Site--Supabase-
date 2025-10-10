"use client";

import { getCurrentUserBlogs } from "@/actions/write/actions";
import BlogListItem from "@/components/BlogListItem";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyBlogsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await getCurrentUserBlogs();

      if (error) {
        toast.error(error);
      } else {
        setBlogs(
          (data ?? []).map((blog: any) => ({
            ...blog,
            user_id: blog.author?.id ?? null,
          }))
        );
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [])

  return (
    <div>
      <h1 className="mt-5 mb-8 text-2xl">My Blog's</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        blogs.length === 0 && (
          <p className="text-center mb-6">No blogs found.</p>
        )
      )}

      <div className="flex flex-col justify-between gap-8">
        {/* Post Lists */}
        {blogs.map((blog) => (
          <BlogListItem key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default MyBlogsPage;