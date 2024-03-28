import Link from "next/link";
import Image from "next/image";

export default function Comment({ commentUserId, name, message, picture, timestamp }) {
  return (
    <div className="m-3 sm:ml-7 sm:mt-5 flex gap-1 sm:gap-2.5">
      <Link href={`/users/${commentUserId}`} className="shrink-0">
        <Image
          src={picture || "/myPhoto.svg"}
          alt="user"
          className="w-8 h-8 bg-white rounded-full object-cover object-center"
          width={200}
          height={200}
        />
      </Link>
      <div>
        <div className="pt-2 pb-4 px-3 sm:px-4 rounded-[20px] bg-gray-100 dark:bg-darkLayoutColor">
          <h2 className="text-sm sm:text-base font-semibold dark:text-darkWhiteContentColor break-all">{name}</h2>
          <p className="max-w-[230px] sm:max-w-[640px] text-sm sm:text-base text-zinc-500 break-all">{message}</p>
        </div>
        <p className="mt-1 ps-0.5 text-xs font-normal text-zinc-500">
          {timestamp}
        </p>
      </div>
    </div>
  );
}
