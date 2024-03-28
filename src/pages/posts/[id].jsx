import useSWR from "swr";
import Skeleton from "@mui/material/Skeleton";

import { getServerCookie } from "../../utils/cookie";

import Header from "../../components/Header";
import Post from "../../components/Post";

import useApiWithSWR from "../../hooks/useApiWithSWR";

export default function PostDetail({ token, userId, postId }) {
  const { callApi } = useApiWithSWR();
  const { data: userData, isLoading: isProfileLoading } = useSWR([`/users/${userId}/profile`, userId], () =>
    callApi(`/users/${userId}/profile`, "GET")
  );
  const { data: postData, isLoading: isPostDetailLoading } = useSWR([`/posts/${postId}`, postId], () =>
    callApi(`/posts/${postId}`, "GET")
  );

  return (
    <div>
      <Header
        userPicture={userData?.user?.picture}
        userName={userData?.user?.name}
        userId={userId}
        token={token}
      />
      <main
        className="min-h-screen py-5 sm:py-7 px-5 sm:px-72 bg-layoutColor dark:bg-darkLayoutColor"
      >
        {(isProfileLoading || isPostDetailLoading) ? (
          <div className="mb-3 sm:mb-6 bg-white border border-solid border-gray-200 rounded-2xl">
            <div className="pt-2 sm:pt-5 px-4 sm:px-9 relative border-b border-solid border-gray-300">
              <div className="flex items-center gap-3">
                <Skeleton
                  variant="circular"
                  className="w-14 h-14 sm:w-20 sm:h-20 shrink-0"
                  width={80}
                  height={80}
                />
                <div>
                  <h2 className="text-base font-bold">
                    <Skeleton variant="text" width={60} height={30} />
                  </h2>
                  <p className="text-xs font-normal text-gray-400">
                    <Skeleton variant="text" width={60} height={25} />
                  </p>
                </div>
              </div>
              <div className="pt-4 px-1.5 pb-10">
                <pre className="text-sm sm:text-base">
                  <Skeleton
                    variant="rectangular"
                    className="w-full"
                    height={60}
                  />
                </pre>
              </div>
              <div className="py-2.5 px-1.5 flex gap-2.5 border-t border-b border-solid border-gray-400">
                <Skeleton
                  variant="circular"
                  className="shrink-0"
                  width={23}
                  height={23}
                />
                <Skeleton
                  variant="circular"
                  className="shrink-0"
                  width={23}
                  height={23}
                />
              </div>
              <div className="py-2.5 flex justify-between gap-2.5 text-sm sm:text-base font-sans text-gray-500">
                <p>
                  <Skeleton variant="text" width={80} height={30} />
                </p>
                <p>
                  <Skeleton variant="text" width={50} height={30} />
                </p>
              </div>
            </div>
            <div className="m-3 sm:ml-7 sm:mt-5 flex gap-1 sm:gap-2.5">
              <Skeleton variant="circular" width={32} height={32} />
              <div>
                <div className="pt-2 pb-4 px-3 sm:px-4 rounded-[20px] bg-gray-100">
                  <h2 className="text-sm sm:text-base font-semibold">
                    <Skeleton variant="text" width={60} height={30} />
                  </h2>
                  <p className="max-w-[230px] sm:max-w-[640px] text-sm sm:text-base text-zinc-500 break-all">
                    <Skeleton variant="text" width={80} height={30} />
                  </p>
                </div>
                <p className="mt-1 ps-0.5 text-xs font-normal text-zinc-500">
                  <Skeleton variant="text" width={50} height={30} />
                </p>
              </div>
            </div>
            <div className="py-3 sm:py-5 px-4 sm:px-7 flex items-center gap-3 ">
              <Skeleton
                variant="circular"
                className="shrink-0"
                width={48}
                height={48}
              />
              <div className="w-full flex relative">
                <Skeleton variant="rounded" className="w-full h-7 sm:h-10" />
              </div>
            </div>
          </div>
        ) : (
          typeof postData === "object" &&
          postData !== null && (
            <Post
              id={postData?.post.id}
              picture={postData?.post.picture}
              name={postData?.post.name}
              created_at={postData?.post.created_at}
              context={postData?.post.context}
              like_count={postData?.post.like_count}
              comment_count={postData?.post.comment_count}
              comments={postData?.post.comments}
              is_liked={postData?.post.is_liked}
              userPicture={userData?.user?.picture}
              userId={userId}
              postUserId={postData?.post.user_id}
              postId={postId}
            />
          )
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = getServerCookie("userInfo", "token", context.req);
  const userId = getServerCookie("userInfo", "id", context.req);
  const postId = Number(context.params.id);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token, userId, postId },
  };
}
