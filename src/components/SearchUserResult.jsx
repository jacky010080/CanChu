import Image from "next/image";

export default function SearchUserResult({
  id,
  picture,
  name,
  isStart,
  isEnd,
}) {
  return (
    <a
      href={`/users/${id}`}
      className={`py-[10px] px-[20px] flex items-center gap-4 bg-white dark:bg-darkBackgroundColor 
      ${isStart ? "rounded-t-[20px]" : "border-t border-solid border-gray-300 dark:border-darkBorderColor"}
      ${isEnd && "rounded-b-[20px]"}`}
    >
      <Image
        src={picture || "/myphoto.svg"}
        alt="avatar"
        className="w-[39px] h-[39px] dark:bg-white rounded-full"
        width={200}
        height={200}
      />
      <h4 className="text-base font-medium text-[#566470] dark:text-darkWhiteContentColor break-all">{name}</h4>
    </a>
  );
}
