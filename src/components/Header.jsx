import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

import styles from "../styles/Header.module.scss";
import { removeCookie } from "../utils/cookie";
import useApi from "../hooks/useApi";
import useApiWithSWR from "../hooks/useApiWithSWR";

import SearchUserResult from "./SearchUserResult";
import Event from "./Event";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default function Header({ userPicture, userName, userId }) {
  const router = useRouter();
  const searchUserName = useRef();
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleLogout = () => {
    removeCookie("userInfo");
    router.push("/login");
  };

  const {
    data: { users: searchUserDatas },
    setData: setSearchUserDatas,
    callApi: userSearch,
  } = useApi();

  const handleSearch = () => {
    const keyword = searchUserName.current.value;
    if (keyword) {
      userSearch(`/users/search?keyword=${keyword}`, "GET");
    } else {
      setSearchUserDatas([]);
    }
  };

  const debouncedUserSearch = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(setTimeout(handleSearch, 500));
  };

  const { callApi } = useApiWithSWR();
  const { data: eventsDatas } = useSWR("/events/", () =>
    callApi("/events/", "GET")
  );

  const [unreadEvents, setUnreadEvents] = useState([]);
  const [briefEvents, setBriefEvents] = useState([]);
  useEffect(() => {
    setUnreadEvents(
      eventsDatas?.events?.filter((event) => event.is_read === 0)
    );
    setBriefEvents(eventsDatas?.events?.filter((event, index) => index <= 2));
  }, [eventsDatas]);

  const [isShowAllEvents, setIsShowAllEvents] = useState(false);
  const handleShowAllEvents = () => {
    setIsShowAllEvents(!isShowAllEvents);
  };

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });
  const handleSwitchMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <header className="relative flex flex-col sm:flex-row sm:justify-between items-center gap-3 p-3 sm:py-6 sm:px-36 bg-white dark:bg-darkBackgroundColor border-b border-gray-300 dark:border-darkBorderColor">
      <div className="absolute top-2 left-1">
        <MaterialUISwitch onClick={handleSwitchMode} checked={darkMode} />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-6">
        <Link href="/">
          <h1 className={`${styles.title} text-[#7763FB] font-normal text-4xl`}>
            CanChu
          </h1>
        </Link>
        <div className="relative">
          <input
            type="text"
            id="search"
            className={`${styles.search} w-80 h-9 py-2 sm:py-3 px-2 sm:px-10 bg-gray-100 dark:bg-darkWhiteContentColor border border-gray-300 dark:border-darkWhiteContentColor rounded-lg outline-black`}
            placeholder="搜尋"
            ref={searchUserName}
            onChange={debouncedUserSearch}
          />
          {searchUserDatas?.length && (
            <div className="absolute z-50 w-full border border-solid border-gray-300 dark:border-darkBorderColor rounded-[20px]">
              {searchUserDatas?.map((searchUserData, index) => {
                const { id, picture, name } = searchUserData;
                const isStart = index === 0;
                const isEnd = index === searchUserDatas.length - 1;
                return (
                  <SearchUserResult
                    key={id}
                    id={id}
                    picture={picture}
                    name={name}
                    isStart={isStart}
                    isEnd={isEnd}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* hover選單 */}
      <div className="flex relative gap-4">
        <div className="relative group">
          <Image
            src="/event.svg"
            alt="event"
            className="relative w-12 h-12 sm:w-9 sm:h-9 rounded-full object-cover object-center dark:bg-darkWhiteContentColor"
            width={36}
            height={36}
          />
          {unreadEvents?.length !== 0 && (
            <div className="absolute w-[21px] h-[21px] flex justify-center items-center bg-red-500 rounded-full -top-2 -right-2 z-40">
              <p className="text-sm font-normal text-white">
                {unreadEvents?.length}
              </p>
            </div>
          )}
          <div className="hidden group-hover:block absolute w-56 sm:w-72 inset-0 translate-x-[-7rem] sm:translate-x-[-15.5rem] z-40">
            <div className="py-3 px-4 flex items-center gap-4 bg-primaryColor text-white rounded-t-xl">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shrink-0">
                <Image
                  src="/event.svg"
                  alt="event"
                  className="w-9 h-9 rounded-full"
                  width={36}
                  height={36}
                />
              </div>
              <h4>我的通知</h4>
            </div>
            <div className="px-3.5 flex flex-col bg-white dark:bg-darkBackgroundColor border-l border-r border-b border-solid border-gray-300 dark:border-darkBorderColor rounded-b-xl shadow-lg">
              {isShowAllEvents
                ? eventsDatas?.events?.map((item) => (
                    <Event
                      key={item.id}
                      eventId={item.id}
                      created_at={item.created_at}
                      summary={item.summary}
                      is_read={item.is_read}
                    />
                  ))
                : briefEvents?.map((item) => (
                    <Event
                      key={item.id}
                      eventId={item.id}
                      created_at={item.created_at}
                      summary={item.summary}
                      is_read={item.is_read}
                    />
                  ))}
              {eventsDatas?.events.length !== 0 ? (
                <button
                  type="button"
                  className="py-2 px-2.5 flex-1 text-center dark:text-white underline"
                  onClick={handleShowAllEvents}
                >
                  {isShowAllEvents ? "收起通知" : "查看全部通知"}
                </button>
              ) : (
                <p className="py-2 px-2.5 flex-1 text-center dark:text-white">
                  你沒有通知~
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="group">
          <Image
            src={userPicture || "/myphoto.svg"}
            alt="myphoto"
            className="w-12 h-12 sm:w-9 sm:h-9 bg-white rounded-full object-cover object-center"
            width={360}
            height={360}
          />
          <div className="hidden group-hover:block absolute w-44 sm:w-52 inset-0 translate-x-[3.5rem] sm:translate-x-[-7.5rem] z-50">
            <div className="py-3 px-4 flex items-center gap-4 bg-primaryColor text-white rounded-t-xl">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shrink-0">
                <Image
                  src={userPicture || "/myphoto.svg"}
                  alt="myphoto"
                  className="w-9 h-9 bg-white rounded-full"
                  width={36}
                  height={36}
                />
              </div>
              <h4 className="break-all">{userName || "你的名字"}</h4>
            </div>
            <div className="px-3.5 flex flex-col bg-white dark:bg-darkBackgroundColor border-l border-r border-b border-solid border-gray-300 dark:border-darkBorderColor rounded-b-xl shadow-lg">
              <a
                href={`/users/${userId}`}
                className="py-4 px-2.5 flex-1 text-left dark:text-white border-b border-solid border-gray-300 dark:border-darkBorderColor"
              >
                查看個人檔案
              </a>
              <button
                type="button"
                className="py-4 px-2.5 flex-1 text-left dark:text-white"
                onClick={() => handleLogout()}
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
