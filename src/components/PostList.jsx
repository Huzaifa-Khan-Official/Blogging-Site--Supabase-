import React from "react";
import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axiosInstance.get("/posts", {
    params: {
      page: pageParam,
      limit: 5,
      ...searchParamsObj,
    },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "error") {
    toast.error("An error occurred: " + error.message);
    return <p>An error occurred.</p>;
  }
  
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  
  return (
    <>
      {
        isFetching ? (
          <p className="text-center mb-6">Loading posts...</p>
        ) : allPosts.length === 0 && (
          <p className="text-center mb-6">No posts found.</p>
        )
      }
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading more posts...</h4>}
        endMessage={
          allPosts.length > 0 && (
            <p className="text-center mb-6">
              <b>All posts loaded!</b>
            </p>
          )
        }
      >
        {allPosts.map((post) => (
          <PostListItem key={post?._id} post={post} />
        ))}
      </InfiniteScroll>
    </>
  );
};

export default PostList;