import { useEffect, useRef } from "react";

export default function useInfiniteScroll(updatePosts, threshold) {
  const lastScrollTimeRef = useRef(0);
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const handleScroll = async () => {
    const currentTime = Date.now();
    if (currentTime - lastScrollTimeRef.current > 100) {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollBottom = documentHeight - scrollTop - windowHeight;

      if (scrollBottom <= threshold) {
        await updatePosts();
      }
    }
    lastScrollTimeRef.current = currentTime;
  };
  const debouncedHandleScroll = debounce(handleScroll, 100);
  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll]);
}
