import Image from "next/image";
import { useRef } from "react";
import { mutate } from "swr";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";

import styles from "../styles/Background.module.scss";

import useApi from "../hooks/useApi";

export default function NewPost({ picture, isProfileLoading, pageUserId }) {
  const newPost = useRef();
  const { callApi: createPost } = useApi();

  const handelNewPost = async () => {
    const context = newPost.current.value;
    const data = {
      context,
    };
    await createPost(`/posts/`, "POST", data);
    newPost.current.value = "";
    if (pageUserId) {
      await mutate([`/posts/search?user_id=${pageUserId}`, pageUserId]);
    } else {
      await mutate("/posts/search");
    }
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "發文成功!",
    });
  };

  return (
    <div className="mx-auto mb-4 sm:mb-6 p-3 sm:p-5 flex flex-col bg-white dark:bg-darkBackgroundColor border border-solid border-gray-200 dark:border-darkBorderColor rounded-2xl">
      <div className="flex gap-3 sm:gap-6">
        {isProfileLoading ? (
          <Skeleton
            variant="circular"
            className="shrink-0"
            width={80}
            height={80}
          />
        ) : (
          <Image
            src={picture || "/myphoto.svg"}
            alt="avatar"
            className="w-14 h-14 sm:w-20 sm:h-20 dark:bg-white rounded-full object-cover object-center shrink-0"
            width={200}
            height={200}
          />
        )}
        <textarea
          name="textarea"
          className={`${styles.newPost} p-2 sm:p-4 bg-gray-100 dark:bg-darkWhiteContentColor w-full h-24 min-h-full text-sm sm:text-base border border-solid border-gray-300 dark:border-darkWhiteContentColor rounded-2xl outline-black`}
          placeholder="說點什麼嗎？"
          cols="30"
          ref={newPost}
        />
      </div>
      <button
        type="button"
        className="mt-3 py-2 px-7 self-end bg-primaryColor text-white dark:text-darkWhiteContentColor rounded-lg"
        onClick={handelNewPost}
      >
        發佈貼文
      </button>
    </div>
  );
}
