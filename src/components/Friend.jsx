import Link from "next/link";
import Image from "next/image";

export default function Friend({ id, name, picture }) {
  return (
    <div className="my-1.5 flex items-center gap-2 sm:gap-3.5">
      <Link href={`/users/${id}`} className="shrink-0">
        <Image
          src={picture || "/myphoto.svg"}
          alt="avatar"
          className="w-10 h-10 bg-white rounded-full object-cover object-center"
          width={200}
          height={200}
        />
      </Link>
      <Link href={`/users/${id}`}>
        <h5 className="text-base sm:text-lg font-bold">{name || "好友"}</h5>
      </Link>
    </div>
  );
}
