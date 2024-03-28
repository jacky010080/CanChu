import Image from "next/image";
import { mutate } from "swr";

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

export default function Event({ eventId, created_at, summary, is_read }) {
  const { callApi: readEvent } = useApi();

  const handleReadEvent = async () => {
    await readEvent(`/events/${eventId}/read`, "POST", {});
    await mutate("/events/");
  };

  return (
    <button
      type="button"
      className="py-2 flex justify-between items-center text-base text-left border-b border-solid border-gray-300 dark:border-darkBorderColor"
      onClick={handleReadEvent}
    >
      <div>
        <p
          className={`${is_read && "text-[#909090]"} dark:text-${
            is_read ? "text-[#909090]" : "darkWhiteContentColor"
          } break-all`}
        >
          {summary}
        </p>
        <p
          className={`text-sm font-bold text-[${
            is_read ? "#909090" : "#5458F7"
          }]`}
        >
          {created_at
            ? calculateTimeDiff(transformTime(created_at), new Date())
            : "幾千年前"}
        </p>
      </div>
      {!is_read && (
        <Image src="/check.png" alt="check" width={12} height={12} />
      )}
    </button>
  );
}
