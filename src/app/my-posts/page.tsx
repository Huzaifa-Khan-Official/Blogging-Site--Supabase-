// import { useInfiniteQuery } from "@tanstack/react-query";
// import { axiosInstance } from "../lib/axios";
// import PostListItem from "../components/PostListItem";
// import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

// const fetchPosts = async (pageParam) => {
//   const res = await axiosInstance.get("/users/my-blogs", {
//     params: {
//       page: pageParam,
//       limit: 5,
//     },
//   });
//   return res.data;
// };

const MyPostsPage = () => {
//   const {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ["blogs"],
//     queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
//     getNextPageParam: (lastPage, pages) =>
//       lastPage.hasMore ? pages.length + 1 : undefined,
//   });

//   if (status === "error") {
//     toast.error("An error occurred: " + error.message);
//     return <p>An error occurred.</p>;
//   }

//   const allPosts = data?.pages?.flatMap((page) => page.blogs) || [];

  return (
    <div>
      <h1 className="mt-5 mb-8 text-2xl">My Blog's</h1>

      {/* {isFetching ? (
        <p className="text-center mb-6">Loading blogs...</p>
      ) : (
        allPosts.length === 0 && (
          <p className="text-center mb-6">No blogs found.</p>
        )
      )} */}

      <div className="flex flex-col justify-between gap-8">
        {/* Post Lists */}
        {/* <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
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
      </div>
    </div>
  );
};

export default MyPostsPage;