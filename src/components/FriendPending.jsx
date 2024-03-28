import Link from "next/link";
import Image from "next/image";

import { mutate } from "swr";
import Swal from "sweetalert2";

import useApi from "../hooks/useApi";

export default function FriendPending({ id, name, picture, friendshipId }) {
  const { callApi: friendsAgree } = useApi();
  const { callApi: deleteFriend } = useApi();

  const refreshFriends = async () => {
    await mutate("/friends/");
    await mutate("/friends/pending");
    await mutate("/posts/search");
  };
  const handleFriendsAgree = async () => {
    await friendsAgree(`/friends/${friendshipId}/agree`, "POST", {});
    await refreshFriends();
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "你們成為朋友了！",
    });
  };
  const handleDeleteFriend = async () => {
    await deleteFriend(`/friends/${friendshipId}`, "DELETE");
    await refreshFriends();
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "不跟他當朋友QQ",
    });
  };

  return (
    <div className="my-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3.5">
        <Link href={`/users/${id}`} className="shrink-0">
          {picture ? (
            <Image
              src={picture}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover object-center"
              width={200}
              height={200}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          )}
        </Link>
        <Link href={`/users/${id}`}>
          <h5 className="text-sm sm:text-lg font-bold">
            {name || "黑衣人"}的好友邀請
          </h5>
        </Link>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base font-normal text-white bg-primaryColor rounded-md"
          onClick={handleFriendsAgree}
        >
          確認
        </button>
        <button
          type="button"
          className="py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base font-normal text-white bg-[#BFBFBF] rounded-md"
          onClick={handleDeleteFriend}
        >
          取消
        </button>
      </div>
    </div>
  );
}
