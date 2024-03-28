import Cookies from "js-cookie";

export function setCookie(key, value, maxAge) {
  const cookieValue = JSON.stringify(value);
  Cookies.set(key, cookieValue, { expires: maxAge, path: "/" });
}

export function getClientCookie(prefix, key) {
  const cookieValue = Cookies.get(prefix);
  if (cookieValue) {
    const userInfo = JSON.parse(cookieValue);
    return userInfo[key];
  }
  return null;
}

export function getServerCookie(prefix, key, req) {
  if (req && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie
      .split(";")
      .reduce((cookieObj, cookie) => {
        const [name, value] = cookie.trim().split("=");
        return {
          ...cookieObj,
          [name]: decodeURIComponent(value),
        };
      }, {});
    const cookieValue = cookies[prefix];
    if (cookieValue) {
      const userInfo = JSON.parse(cookieValue);
      return userInfo[key];
    }
  }
  return null;
}

export function removeCookie(key) {
  Cookies.remove(key);
}
