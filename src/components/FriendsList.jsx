import Image from "next/image";

import Friend from "./Friend";
import NoFriend from "./NoFriend";

export default function FriendsList({ friendsDatas }) {
  return friendsDatas?.users?.length > 0 ? (
    <div>
      <div className="my-2 flex items-center gap-2 sm:gap-3.5">
        <div className="w-10 h-10 flex justify-center items-center dark:bg-white dark:rounded-sm shrink-0">
          <Image src="/friends.png" alt="friends" width={26} height={26} />
        </div>
        <h5 className="text-base sm:text-lg font-bold text-gray-500 dark:text-white">
          我的好友
        </h5>
      </div>
      {friendsDatas?.users?.map((friendsData) => (
        <Friend
          key={friendsData.id}
          id={friendsData.id}
          name={friendsData.name}
          picture={friendsData.picture}
        />
      ))}
      <div className="my-1.5 sm:my-2 flex items-center gap-2 sm:gap-3.5">
        <Image
          src="/list.png"
          alt="list"
          className="w-10 h-10 dark:p-px dark:bg-white dark:rounded-sm"
          width={39}
          height={39}
        />
        <h5 className="text-base sm:text-lg font-medium dark:text-white border-b border-solid border-black dark:border-white">
          查看全部
        </h5>
      </div>
    </div>
  ) : (
    <NoFriend />
  );
}
