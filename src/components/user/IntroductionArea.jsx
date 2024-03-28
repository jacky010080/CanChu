import { useState, useRef } from "react";
import { mutate } from "swr";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";

import useApi from "../../hooks/useApi";

export default function IntroductionArea({
  userName,
  introduction,
  tags,
  friendship,
  userId,
  pageUserId,
  isPageUserProfileLoading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const intro = useRef();
  const tag = useRef();
  const habits = tags?.split(",");

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const resetEdit = () => {
    intro.current.value = "";
    tag.current.value = "";
  };
  const handleCancel = () => {
    resetEdit();
    handleEdit();
  };

  const { callApi: updateProfile } = useApi();
  const handleUpdateProfile = async () => {
    const newIntro = intro.current.value;
    const newTag = tag.current.value;
    await updateProfile("/users/profile", "PUT", {
      name: userName,
      introduction: newIntro,
      tags: newTag,
    });
    resetEdit();
    handleEdit();
    await mutate([`/users/${userId}/profile`, userId]);
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "更改簡介成功!",
    });
  };

  const { callApi: friendsRequest } = useApi();
  const { callApi: deleteFriend } = useApi();
  const { callApi: friendsAgree } = useApi();

  const handleFriendship = async () => {
    if (friendship?.status === "requested") {
      await deleteFriend(`/friends/${friendship?.id}`, "DELETE");
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
    } else if (friendship?.status === "friend") {
      await deleteFriend(`/friends/${friendship?.id}`, "DELETE");
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      }).fire({
        width: "400px",
        icon: "success",
        title: "刪除好友QQ",
      });
    } else if (friendship?.status === "pending") {
      await friendsAgree(`/friends/${friendship?.id}/agree`, "POST", {});
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
    } else {
      await friendsRequest(`/friends/${pageUserId}/request`, "POST", {});
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      }).fire({
        width: "400px",
        icon: "success",
        title: "送出好友邀請",
      });
    }
    mutate([`/users/${pageUserId}/profile`, pageUserId]);
  };

  const friendshipStatusMessage = friendship?.status;
  let friendStatus;
  if (friendshipStatusMessage === "requested") {
    friendStatus = "刪除好友邀請";
  } else if (friendshipStatusMessage === "friend") {
    friendStatus = "刪除好友";
  } else if (friendshipStatusMessage === "pending") {
    friendStatus = "答應好友邀請";
  } else {
    friendStatus = "邀請成為好友";
  }

  return (
    <aside className="w-5/6 sm:w-7/12 mx-auto flex flex-col items-center gap-3 sm:gap-5">
      {isEditing ? (
        <div className="w-full py-3 sm:py-5 px-1 sm:px-3 flex flex-col gap-5 bg-white dark:bg-darkBackgroundColor border border-solid border-gray-200 dark:border-darkBorderColor rounded-2xl">
          <div className="px-3 flex flex-col gap-3 sm:gap-9">
            <div>
              <label
                className="block mb-2 text-lg font-bold text-gray-700 dark:text-white"
                htmlFor="introduction"
              >
                自我介紹
              </label>
              <textarea
                type="text"
                id="introduction"
                name="introduction"
                className="w-full p-1 sm:p-2 bg-[#F0F2F5] dark:bg-darkWhiteContentColor border border-solid border-[#BFBFBF] dark:border-darkWhiteContentColor rounded-[10px]"
                ref={intro}
                required
              />
            </div>
            <div>
              <label
                className="block mb-2 text-lg font-bold text-gray-700 dark:text-white"
                htmlFor="habits"
              >
                興趣
              </label>
              <textarea
                type="text"
                id="habits"
                name="habits"
                placeholder="例如：chatGPT,系統思考,設計思考"
                className="w-full p-1 sm:p-2 bg-[#F0F2F5] dark:bg-darkWhiteContentColor border border-solid border-[#BFBFBF] dark:border-darkWhiteContentColor rounded-[10px]"
                ref={tag}
                required
              />
            </div>
          </div>
          <div className="sm:mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="py-2 px-7 text-base font-bold text-white bg-[#5458F7] rounded-md"
              onClick={handleUpdateProfile}
            >
              確認
            </button>
            <button
              type="button"
              className="py-2 px-7 text-base font-bold text-white bg-[#D3D3D3] rounded-md"
              onClick={handleCancel}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full pt-5 pb-11 px-3 flex flex-col gap-5 bg-white dark:bg-darkBackgroundColor border border-solid border-gray-200 dark:border-darkBorderColor rounded-2xl">
          {isPageUserProfileLoading ? (
            <>
              <Skeleton variant="text" className="w-full" height={70} />
              <div>
                <h4 className="text-lg font-bold text-gray-700">
                  <Skeleton variant="text" width={60} height={40} />
                </h4>
                <p className="text-base font-medium text-gray-600">
                  <Skeleton variant="text" width={50} height={30} />
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-700">
                  <Skeleton variant="text" width={60} height={40} />
                </h4>
                <div className="flex gap-3 sm:gap-1.5 flex-wrap">
                  <Skeleton variant="text" width={80} height={60} />
                  <Skeleton variant="text" width={80} height={60} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                {pageUserId === userId ? (
                  <button
                    type="button"
                    className="w-full py-2 text-center bg-blue-600 text-white rounded-md"
                    onClick={handleEdit}
                  >
                    編輯個人檔案
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`w-full py-2 text-center ${
                      friendshipStatusMessage === "friend"
                        ? "bg-red-600"
                        : "bg-primaryColor"
                    } text-white rounded-md`}
                    onClick={handleFriendship}
                  >
                    {friendStatus || "邀請成為好友"}
                  </button>
                )}
              </div>
              <div>
                <h4 className="mb-2 text-lg font-bold text-gray-700 dark:text-white">
                  自我介紹
                </h4>
                <p className="text-base font-medium text-gray-600 dark:text-darkWhiteContentColor break-all">
                  {introduction || "這個人很懶，都不自我介紹"}
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-bold text-gray-700 dark:text-white">
                  興趣
                </h4>
                <div className="flex gap-3 sm:gap-1.5 flex-wrap">
                  {habits && habits[0] !== "" ? (
                    habits.map((habit) => (
                      <p
                        key={habit}
                        className="py-2 px-5 text-sm font-medium text-black dark:text-darkWhiteContentColor border border-solid border-black dark:border-darkWhiteContentColor rounded-3xl break-all"
                      >
                        {habit}
                      </p>
                    ))
                  ) : (
                    <p className="py-2 px-5 text-sm font-medium text-black dark:text-darkWhiteContentColor border border-solid border-black dark:border-darkWhiteContentColor rounded-3xl">
                      沒半點興趣，可憐哪
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <p className="mb-5 mx-auto text-sm sm:text-base font-normal text-gray-800 dark:text-darkWhiteContentColor">
        關於我們 · 隱私權條款 · Cookie 條款 · <br />
        &copy; 2023 CanChu, Inc.
      </p>
    </aside>
  );
}
