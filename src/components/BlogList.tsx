import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBlogs } from "@/actions/write/actions";
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton"
import BlogListItem from "./BlogListItem";
import { useSearchParams } from "next/navigation";

const BlogList = () => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('cat');
    const sort = searchParams.get('sort');

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
  }, [searchParams]);

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
      {
        data.length === 0 && (
          <p className="text-center mb-6">No blogs found.</p>
        )
      }
      {data.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;
