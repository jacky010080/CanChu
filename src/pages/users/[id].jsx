import Link from "next/link";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Skeleton from "@mui/material/Skeleton";

import { getServerCookie } from "../../utils/cookie";

import Header from "../../components/Header";
import Profile from "../../components/user/Profile";
import IntroductionArea from "../../components/user/IntroductionArea";
import NewPost from "../../components/NewPost";
import Post from "../../components/Post";

import useApi from "../../hooks/useApi";
import useApiWithSWR from "../../hooks/useApiWithSWR";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function PersonalProfilePage({ token, userId, pageUserId }) {
  const { callApi } = useApiWithSWR();
  const { data: userData, isLoading: isProfileLoading } = useSWR(
    [`/users/${userId}/profile`, userId],
    () => callApi(`/users/${userId}/profile`, "GET")
  );
  const { data: pageUserData, isLoading: isPageUserProfileLoading } = useSWR(
    [`/users/${pageUserId}/profile`, pageUserId],
    () => callApi(`/users/${pageUserId}/profile`, "GET")
  );
  const { data: initialPostDatas, isLoading: isPostsLoading } = useSWR(
    [`/posts/search?user_id=${pageUserId}`, pageUserId],
    () => callApi(`/posts/search?user_id=${pageUserId}`, "GET")
  );
  const [postDatas, setPostDatas] = useState({});
  useEffect(() => {
    setPostDatas(initialPostDatas);
  }, [initialPostDatas]);

  const {
    data: { posts: newPosts, next_cursor },
    callApi: getPostByCursor,
  } = useApi();
  const handleGetPostByCursor = async () => {
    if (!postDatas.next_cursor) {
      return;
    }
    await getPostByCursor(
      `/posts/search?cursor=${postDatas.next_cursor}`,
      "GET"
    );
  };
  useEffect(() => {
    if (newPosts) {
      setPostDatas({
        posts: [...postDatas.posts, ...newPosts],
        next_cursor,
      });
    }
  }, [newPosts]);

  useInfiniteScroll(handleGetPostByCursor, 100);

  useEffect(() => {
    const handleScroll = () => {
      if (isProfileLoading || isPageUserProfileLoading || isPostsLoading) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isProfileLoading, isPageUserProfileLoading, isPostsLoading]);

  return (
    <div>
      <Header
        userPicture={userData?.user?.picture}
        userName={userData?.user?.name}
        userId={userId}
        token={token}
      />
      <div className="sm:px-36 dark:bg-darkBackgroundColor">
        <Profile
          picture={pageUserData?.user?.picture}
          name={pageUserData?.user?.name}
          friend_count={pageUserData?.user?.friend_count}
          userId={userId}
          pageUserId={pageUserId}
          isPageUserProfileLoading={isPageUserProfileLoading}
        />
        <nav>
          <ul className="flex">
            <Link href="/">
              <li className="px-4 sm:px-7 py-3 sm:py-5 text-base sm:text-xl font-bold text-primaryColor border-b-4 border-solid border-primaryColor">
                貼文
              </li>
            </Link>
          </ul>
        </nav>
      </div>
      <div className="pt-3 sm:pt-8 sm:px-36 min-h-screen sm:flex sm:justify-between sm:gap-8 bg-layoutColor dark:bg-darkLayoutColor">
        <IntroductionArea
          userName={userData?.user?.name}
          introduction={pageUserData?.user?.introduction}
          tags={pageUserData?.user?.tags}
          userId={userId}
          pageUserId={pageUserId}
          friendship={pageUserData?.user?.friendship}
          isPageUserProfileLoading={isPageUserProfileLoading}
        />
        <main className="px-3 sm:px-0 sm:w-full pb-5">
          {userId === pageUserId && (
            <NewPost
              picture={pageUserData?.user?.picture}
              isProfileLoading={isProfileLoading}
              pageUserId={pageUserId}
            />
          )}
          {isPostsLoading ? (
            <div className="mb-3 sm:mb-6 bg-white border border-solid border-gray-200 rounded-2xl">
              <div className="pt-2 sm:pt-5 px-4 sm:px-9 relative border-b border-solid border-gray-300">
                <div className="flex items-center gap-3">
                  <Skeleton
                    variant="circular"
                    className="shrink-0"
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
            postDatas?.posts?.map((postData) => (
              <Post
                key={postData.id}
                id={postData.id}
                picture={postData.picture}
                name={pageUserData?.user?.name}
                created_at={postData.created_at}
                context={postData.context}
                like_count={postData.like_count}
                comment_count={postData.comment_count}
                is_liked={postData.is_liked}
                userPicture={userData?.user?.picture}
                userId={userId}
                postUserId={pageUserId}
              />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = getServerCookie("userInfo", "token", context.req);
  const userId = getServerCookie("userInfo", "id", context.req);
  const pageUserId = Number(context.params.id);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token, userId, pageUserId },
  };
}
