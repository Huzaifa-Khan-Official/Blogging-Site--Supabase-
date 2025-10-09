import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBlogs } from "@/actions/write/actions";
import BlogCardSkeleton from"@/components/skeletons/BlogCardSkeleton"
import BlogListItem from "./BlogListItem";
// import InfiniteScroll from "react-infinite-scroll-component";

// const fetchPosts = async (pageParam, searchParams) => {
//   const searchParamsObj = Object.fromEntries([...searchParams]);

//   // const res = await axiosInstance.get("/blogs", {
//   //   params: {
//   //     page: pageParam,
//   //     limit: 5,
//   //     ...searchParamsObj,
//   //   },
//   // });
//   // return res.data;
// };

const BlogList = () => {
  // const [searchParams] = useSearchParams();
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await getBlogs();

      if (error) {
        toast.error(error);
      } else {
        setData(data ?? []);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [])

  // const {
  //   data,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   status,
  // } = useInfiniteQuery({
  //   queryKey: ["blogs", searchParams.toString()],
  //   queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
  //   getNextPageParam: (lastPage, pages) =>
  //     lastPage.hasMore ? pages.length + 1 : undefined,
  // });

  // if (status === "error") {
  //   toast.error("An error occurred: " + error.message);
  //   return <p>An error occurred.</p>;
  // }

  // const allPosts = data?.pages?.flatMap((page) => page.blogs) || [];

  if (loading) {
    // Show skeleton while loading
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
      {/* {
        isFetching ? (
          <p className="text-center mb-6">Loading blogs...</p>
        ) : allPosts.length === 0 && (
          <p className="text-center mb-6">No blogs found.</p>
        )
      } */}
      {/* <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading more blogs...</h4>}
        endMessage={
          allPosts.length > 0 && (
            <p className="text-center mb-6">
              <b>All blogs loaded!</b>
            </p>
          )
        }
      >
        {allPosts.map((post) => (
          <PostListItem key={post?._id} post={post} />
        ))}
      </InfiniteScroll> */}
      {data.map((blog) => (
        <BlogListItem key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;