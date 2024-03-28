import Image from "next/image";

import { useState, useRef } from "react";
import { mutate } from "swr";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";

import styles from "../../styles/Profile.module.scss";
import useApi from "../../hooks/useApi";

let file;

export default function Profile({
  picture,
  name,
  friend_count,
  userId,
  pageUserId,
  isPageUserProfileLoading,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const resetFile = () => {
    setPreviewImage(null);
    fileInputRef.current = null;
  };

  const toggleEditingAvatar = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      resetFile();
    }
  };

  // 圖片預覽
  const showPreview = () => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 上傳圖片檔案
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      [file] = e.target.files;
      showPreview(selectedFile);
    }
  };

  const { callApi: updatePicture } = useApi();

  const handleUpdatePicture = async () => {
    const formData = new FormData();
    formData.append("picture", file);
    await updatePicture("/users/picture", "PUT", formData);
    toggleEditingAvatar();
    await mutate([`/users/${userId}/profile`, userId]);
    await mutate([`/users/${pageUserId}/profile`, pageUserId]);
    await mutate([`/posts/search?user_id=${pageUserId}`, pageUserId]);
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
    }).fire({
      width: "400px",
      icon: "success",
      title: "更換頭像成功!",
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    [file] = e.dataTransfer.files;
    showPreview();
  };

  return (
    <div className="px-5 py-6 sm:py-11 flex items-center gap-5 sm:gap-11 border-b border-solid border-gray-300 dark:border-darkWhiteContentColor">
      {isEditing ? (
        <div
          className="w-full min-h-[200px] sm:max-w-[350px] sm:min-h-[400px] p-2 flex flex-col justify-between items-center relative dark:bg-darkLayoutColor border border-solid border-black dark:border-darkBorderColor rounded-[20px] shadow-lg"
          onDrop={handleDrop}
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
        >
          <h3 className="text-2xl font-thin dark:text-white">編輯頭像</h3>
          <button
            type="button"
            onClick={toggleEditingAvatar}
            className="w-6 h-6 absolute top-3 right-5 bg-primaryColor text-white rounded-full"
          >
            X
          </button>
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview"
              className="w-full"
              width={280}
              height={280}
            />
          ) : (
            <div className="w-[250px] flex flex-col items-center dark:bg-darkBackgroundColor border border-dashed border-primaryColor p-2 rounded-md cursor-pointer">
              <p className="text-center dark:text-white">
                拖放圖片到此區域上傳
                <br />
                or
              </p>
              <input
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept="image/gif, image/jpeg, image/png"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-primaryColor"
              >
                點擊選擇圖片
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleUpdatePicture}
            className="mt-2 py-2 px-10 bg-primaryColor text-white rounded-md"
          >
            上傳
          </button>
        </div>
      ) : (
        <>
          <div className={`${styles.container} relative shrink-0`}>
            {isPageUserProfileLoading ? (
              <Skeleton
                variant="circular"
                className="shrink-0"
                width={180}
                height={180}
              />
            ) : (
              <>
                <Image
                  src={picture || "/myphoto.svg"}
                  alt="avatar"
                  className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] dark:bg-white rounded-full object-cover object-center"
                  width={180}
                  height={180}
                />
                <div
                  className={`${styles.overlay} w-full h-full absolute top-0 left-0 border-2 border-solid border-primaryColor rounded-full opacity-0`}
                >
                  <button
                    type="button"
                    className={`${styles.text} absolute top-1/2 left-1/2 text-base text-white underline opacity-0`}
                    onClick={() => {
                      toggleEditingAvatar();
                    }}
                  >
                    編輯大頭貼
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3.5 sm:gap-5 break-all">
            <h2 className="text-3xl sm:text-4xl font-bold dark:text-darkWhiteContentColor">
              {isPageUserProfileLoading ? (
                <Skeleton variant="text" width={80} height={50} />
              ) : (
                name
              )}
            </h2>
            <p className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-400">
              {isPageUserProfileLoading ? (
                <Skeleton variant="text" width={60} height={30} />
              ) : (
                `${friend_count}位朋友`
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
