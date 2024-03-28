import Link from "next/link";
import Image from "next/image";

import { useState, useCallback } from "react";
import { mutate } from "swr";
import Swal from "sweetalert2";

import Comment from "./post/Comment";
import CommentBar from "./CommentBar";

import useApi from "../hooks/useApi";

function transformTime(timeString) {
  const dateString = timeString;
  const dateParts = dateString.split(/[- :]/);
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);
  const hours = parseInt(dateParts[3], 10);
  const minutes = parseInt(dateParts[4], 10);
  const seconds = parseInt(dateParts[5], 10);
  const convertedDate = new Date(year, month, day, hours, minutes, seconds);
  return convertedDate;
}
function calculateTimeDiff(startTime, endTime) {
  const timeDiffMs = endTime - startTime;
  const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 5) {
    return startTime.toLocaleString();
  }
  if (days >= 1) {
    return `${days} 天前`;
  }
  return `${hours} 小時前`;
}

export default function Post({
  id,
  name,
  picture,
  context,
  like_count,
  comment_count,
  comments,
  created_at,
  is_liked,
  userPicture,
  postId,
  userId,
  postUserId,
}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const handleMouseEnter = () => {
    setIsMouseOver(!isMouseOver);
  };

  const [isLiked, setIsLiked] = useState(is_liked);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const [likeCount, setLikeCount] = useState(like_count);
  const [isHandlingLike, setIsHandlingLike] = useState(false);

  const { callApi: postCreateLike } = useApi();
  const { callApi: postDeleteLike } = useApi();

  const playLikeSound = () => {
    const audio = new Audio("/RRR.mp3");
    audio.play();
  };

  const handleLike = useCallback(async () => {
    if (isHandlingLike) {
      return;
    }
    playLikeSound();
    setIsHandlingLike(true);
    setIsLiked(!isLiked);

    setLikeAnimate(true);
    setTimeout(() => {
      setLikeAnimate(false);
    }, 500);

    try {
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
        await postDeleteLike(`/posts/${id}/like`, "DELETE");
      } else {
        setLikeCount((prev) => prev + 1);
        await postCreateLike(`/posts/${id}/like`, "POST", {});
      }
    } catch (err) {
      setIsLiked(is_liked);
      setLikeCount(like_count);
      console.log(err);
    }

    setTimeout(() => {
      setIsHandlingLike(false);
    }, 1000);
  }, [isLiked, isHandlingLike]);

  const [isEditing, setIsEditing] = useState(false);
  const [newContext, setNewContext] = useState(context);
  const { callApi: postUpdated } = useApi();

  const handleInputChange = (e) => {
    setNewContext(e.target.value);
  };
  const handlePostEdit = async () => {
    if (isEditing) {
      const data = {
        context: newContext,
      };
      await postUpdated(`/posts/${id}`, "PUT", data);
      if (postId) {
        await mutate([`/posts/${postId}`, postId]);
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
        title: "修改貼文成功!",
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="mb-3 sm:mb-6 bg-white dark:bg-darkBackgroundColor border border-solid border-gray-200 dark:border-darkBorderColor rounded-2xl">
      <main
        className="pt-2 sm:pt-5 px-4 sm:px-9 relative border-b border-solid border-gray-300 dark:border-darkBorderColor"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseEnter}
      >
        {userId === postUserId && isMouseOver && (
          <button
            type="button"
            className="absolute top-3 sm:top-4 right-4 sm:right-5"
            onClick={() => handlePostEdit()}
          >
            <Image
              src="/edit.png"
              alt="edit"
              className="w-6 h-6 p-1 rounded-[3px] bg-primaryColor"
              width={150}
              height={150}
            />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Link href={`/posts/${id}`} className="shrink-0">
            <Image
              src={picture || "/myPhoto.svg"}
              alt="avatar"
              className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-full object-cover object-center"
              width={180}
              height={180}
            />
          </Link>
          <div>
            <h2 className="text-base font-bold break-all dark:text-darkWhiteContentColor">
              {name || "那個不能說的名字"}
            </h2>
            <Link href={`/posts/${id}`}>
              <p className="text-xs font-normal text-gray-400">
                {created_at
                  ? calculateTimeDiff(transformTime(created_at), new Date())
                  : "幾千年前"}
              </p>
            </Link>
          </div>
        </div>
        <div className="pt-4 px-1.5 pb-10">
          {isEditing ? (
            <textarea
              className="p-2 w-full min-h-full text-sm sm:text-base bg-[#F0F2F5] border border-solid border-[#D9D9D9] rounded-2xl outline-black"
              value={newContext}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          ) : (
            <p className="text-sm sm:text-base break-all dark:text-darkWhiteContentColor">
              {context || "我看你好像很勇嘛"}
            </p>
          )}
        </div>
        <div className="py-2.5 px-1.5 flex gap-2.5 border-t border-b border-solid border-gray-400 dark:border-darkBorderColor">
          <div className="group relative h-[20px]">
            <button
              type="button"
              onClick={handleLike}
              className={`duration-500 ease-in-out transform hover:scale-125 focus:outline-none ${
                likeAnimate && "animate-ping"
              }`}
            >
              {isLiked ? (
                <Image
                  src="/fullHeart.png"
                  alt="fullHeart"
                  className="w-[20px] h-[20px] sm:w-[23px] sm:h-[23px]"
                  width={23}
                  height={23}
                />
              ) : (
                <Image
                  src="/hollowHeart.png"
                  alt="hollowHeart"
                  className="w-[20px] h-[20px] sm:w-[23px] sm:h-[23px]"
                  width={23}
                  height={23}
                />
              )}
            </button>
            <p className="hidden group-hover:inline absolute top-6 -left-5 w-16 px-0.5 px-1 bg-white text-center text-xs font-semibold text-black border-2 border-solid border-red-600 rounded-md animate-pulse">
              山羌警報
            </p>
          </div>
          <Image
            src="/comment.png"
            alt="comment"
            className="w-[19px] h-[19px] sm:w-[22px] sm:h-[22px]"
            width={28}
            height={28}
          />
        </div>
        <div className="py-2.5 flex justify-between gap-2.5 text-sm sm:text-base font-sans text-gray-500 dark:text-white">
          <p>
            <Link href={`/posts/${id}`}>
              {Number.isFinite(likeCount) ? `${likeCount} ` : "沒有"}
            </Link>
            人喜歡這則貼文
          </p>
          <p>
            <Link href={`/posts/${id}`}>
              {comment_count !== undefined &&
              comment_count !== null &&
              !Number.isNaN(comment_count)
                ? `${comment_count} `
                : "沒半"}
            </Link>
            則留言
          </p>
        </div>
      </main>
      {comments?.map((comment) => {
        const { user, content } = comment;
        const commentId = comment.id;
        const startTime = new Date(comment.created_at);
        const endTime = new Date();
        return (
          <Comment
            key={commentId.toString()}
            commentUserId={comment.user.id}
            name={user.name}
            message={content}
            picture={user.picture}
            timestamp={`${calculateTimeDiff(startTime, endTime)}`}
          />
        );
      })}
      <CommentBar id={id} userPicture={userPicture} postId={postId} />
    </div>
  );
}
