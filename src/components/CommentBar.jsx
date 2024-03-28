import Link from "next/link";
import Image from "next/image";
import { mutate } from "swr";
import Swal from "sweetalert2";

import { useRouter } from "next/router";
import { useRef } from "react";

import useApi from "../hooks/useApi";

export default function CommentBar({ id, userPicture, postId }) {
  const router = useRouter();
  const fullPath = router.asPath;
  const pathWithoutHost = fullPath.replace("http://localhost:3000", "");
  const newComment = useRef();

  const { callApi: createComment } = useApi();
  const resetComment = () => {
    newComment.current.value = "";
  };
  const handleCreateComment = async () => {
    const content = newComment.current.value;
    const data = {
      content,
    };
    await createComment(`/posts/${id}/comment`, "POST", data);
    await mutate([`/posts/${postId}`, postId]);
    resetComment();
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "留言成功!",
    });
  };

  let commentBarContent = (
    <div className="py-3 sm:py-5 px-4 sm:px-7 flex items-center gap-3 ">
      <Image
        src={userPicture || "/myPhoto.svg"}
        alt="avatar"
        className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] bg-white rounded-full object-cover object-center shrink-0"
        width={200}
        height={200}
      />
      <div className="w-full flex relative">
        <textarea
          name="message"
          cols="30"
          rows="10"
          className="py-1 sm:py-2 pl-2 pr-8 sm:px-4 grow w-full h-8 sm:h-12 min-h-full text-sm sm:text-xl leading-6 text-gray-800 bg-gray-100 dark:bg-darkWhiteContentColor border border-solid border-gray-300 dark:border-darkWhiteContentColor rounded-lg outline-black"
          placeholder="留個言吧"
          ref={newComment}
        />
        {pathWithoutHost === `/posts/${id}` && (
          <button type="button" onClick={handleCreateComment}>
            <Image
              src="/airplane.png"
              alt="airplane"
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 absolute top-1 sm:top-2.5 right-2 sm:right-8"
              width={25}
              height={25}
            />
          </button>
        )}
      </div>
    </div>
  );

  if (pathWithoutHost !== `/posts/${id}`) {
    commentBarContent = <Link href={`/posts/${id}`}>{commentBarContent}</Link>;
  }

  return commentBarContent;
}
