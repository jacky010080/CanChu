import Link from "next/link";

export default function ExpandMenu() {
  return (
    <ul className="w-20 mx-auto flex justify-center gap-2">
      <Link href="/">
        <li className="w-2 h-2 bg-gray-400 rounded-full" />
      </Link>
      <Link href="/">
        <li className="w-2 h-2 bg-gray-400 rounded-full" />
      </Link>
      <Link href="/">
        <li className="w-2 h-2 bg-gray-400 rounded-full" />
      </Link>
    </ul>
  );
};
