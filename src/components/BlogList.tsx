'use client';

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBlogs } from "@/actions/write/actions";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton";
import BlogListItem from "./BlogListItem";

interface BlogListProps {
  search?: string | null;
  category?: string | null;
  sort?: string | null;
}

const BlogList = ({ search, category, sort }: BlogListProps) => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await getBlogs(search, category, sort);
      if (error) {
        toast.error(error);
      } else {
        setData(
          // @ts-expect-error - API response type needs proper interface
          (data ?? []).map((blog: BlogPost & { author?: { id?: string } }) => ({
            ...blog,
            user_id: blog.author?.id ?? null,
          }))
        );
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search, category, sort]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {data.length === 0 && (
        <p className="text-center mb-6">No blogs found.</p>
      )}
      {data.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;