import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { setCookie, getServerCookie } from "../../utils/cookie";

import styles from "../../styles/Login.module.scss";

const apiUrl = process.env.API_URL;
const apiVersion = process.env.API_VERSION;
const signInEndPoint = "/users/signin";
const signUpEndPoint = "/users/signup";

const emailRule = /^.+@.+$/;
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const isServerError = (status) => {
  const numberRegex = /^5\d{2}$/;
  return numberRegex.test(status);
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (data) => {
    await axios
      .post(`${apiUrl}${apiVersion}${signInEndPoint}`, data)
      .then((res) => {
        const token = res.data.data.access_token;
        const { id } = res.data.data.user;
        setCookie("userInfo", { token, id }, 1800);
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        }).fire({
          width: "400px",
          icon: "success",
          title: "登入成功!",
        });
      })
      .catch((err) => {
        const { status } = err.response;
        if (isServerError(status)) {
          Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1800,
          }).fire({
            width: "400px",
            icon: "warning",
            iconColor: "red",
            title: "出錯啦!",
            text: "Something's wrong. Please try again later or notify our engineering team",
          });
        } else {
          Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1800,
          }).fire({
            width: "400px",
            icon: "warning",
            iconColor: "red",
            title: "登入失敗!",
          });
        }
      });
  };
  const signUp = async (data) => {
    try {
      await axios.post(`${apiUrl}${apiVersion}${signUpEndPoint}`, data);
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
      }).fire({
        width: "400px",
        icon: "success",
        title: "註冊成功!",
      });
    } catch (err) {
      const { status } = err.response;
      if (isServerError(status)) {
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1800,
        }).fire({
          width: "400px",
          icon: "warning",
          iconColor: "red",
          title: "出錯啦!",
          text: "Something's wrong. Please try again later or notify our engineering team",
        });
      } else {
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1800,
        }).fire({
          width: "400px",
          icon: "warning",
          iconColor: "red",
          title: "註冊失敗!",
        });
      }
    }
  };

  const handlePage = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (payload) => {
    if (isLogin) {
      setIsLoading(true);
      await signIn(payload);
      setIsLoading(false);
      router.push("/");
    } else {
      setIsLoading(true);
      await signUp(payload);
      handlePage();
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 sm:pt-12 px-8 sm:px-72 bg-[#F9F9F9]">
        <div className="flex justify-between rounded-2xl">
          <main className="flex-1 py-5 sm:py-10 flex flex-col items-center bg-white border-t border-b border-l border-solid border-gray-200 rounded-l-2xl">
            <div className="px-12 sm:px-24 flex flex-col items-center">
              <h1
                className={`${styles.title} text-4xl sm:text-6xl font-normal text-[#7763FB]`}
              >
                CanChu
              </h1>
              <h2 className="mt-3 mb-4 sm:mt-10 sm:mb-8 text-2xl sm:text-4xl font-thin">
                {isLogin ? "會員登入" : "會員註冊"}
              </h2>
            </div>
            {isLogin ? (
              <Formik
                key="signInForm"
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = "Email must not be empty";
                  } else if (!emailRule.test(values.email)) {
                    errors.email = "Please enter a valid email";
                  }
                  if (!values.password) {
                    errors.password = "Password must not be empty";
                  } else if (!passwordRule.test(values.password)) {
                    errors.password = "Please enter a valid password";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  const payload = {
                    provider: "native",
                    email: `${values.email.trim()}`,
                    password: `${values.password.trim()}`,
                  };
                  handleSubmit(payload);
                  resetForm();
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="w-10/12 sm:w-8/12 flex flex-col gap-5">
                    <div>
                      <label htmlFor="email" className="text-base font-medium">
                        電子郵件
                      </label>
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="text"
                        name="email"
                        placeholder="例: shirney@appworks.tw"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="text-base font-medium"
                      >
                        密碼
                      </label>
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="password"
                        name="password"
                        placeholder="大小寫英文及數字且8碼以上"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-[100px] sm:w-[140px] mb-3 sm:mb-2 py-2 px-8 sm:px-12 self-center text-base font-normal text-white bg-[#5458F7] rounded-md"
                      disabled={isSubmitting}
                    >
                      {isLogin ? "登入" : "註冊"}
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                key="signUpForm"
                initialValues={{
                  name: "",
                  email: "",
                  firstPassword: "",
                  secondPassword: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = "Name must not be empty";
                  }
                  if (!values.email) {
                    errors.email = "Email must not be empty";
                  } else if (!emailRule.test(values.email)) {
                    errors.email = "Please enter a valid email";
                  }
                  if (!values.firstPassword) {
                    errors.firstPassword = "Password must not be empty";
                  } else if (!passwordRule.test(values.firstPassword)) {
                    errors.firstPassword = "Please enter a valid password";
                  }
                  if (!values.secondPassword) {
                    errors.secondPassword = "Password must not be empty";
                  } else if (!passwordRule.test(values.secondPassword)) {
                    errors.secondPassword = "Please enter a valid password";
                  } else if (values.firstPassword !== values.secondPassword) {
                    errors.secondPassword = "Passwords must be equal";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  const payload = {
                    provider: "native",
                    name: `${values.name.trim()}`,
                    email: `${values.email.trim()}`,
                    password: `${values.secondPassword.trim()}`,
                  };
                  handleSubmit(payload);
                  resetForm();
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="w-10/12 sm:w-8/12 flex flex-col gap-5">
                    <div>
                      <label htmlFor="name" className="text-base font-medium">
                        使用者名稱
                      </label>
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="text"
                        name="name"
                        placeholder="例: shirney@appworks.tw"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-base font-medium">
                        電子郵件
                      </label>
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="text"
                        name="email"
                        placeholder="例: shirney@appworks.tw"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="firstPassword"
                        className="text-base font-medium"
                      >
                        密碼
                      </label>
                      <ErrorMessage
                        name="firstPassword"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="password"
                        name="firstPassword"
                        placeholder="大小寫英文及數字且8碼以上"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="secondPassword"
                        className="text-base font-medium"
                      >
                        再次輸入密碼
                      </label>
                      <ErrorMessage
                        name="secondPassword"
                        component="p"
                        className="inline-block sm:inline sm:ml-2 px-2 py-0.5 text-xs sm:text-base text-red-500 bg-red-200 rounded-md"
                      />
                      <Field
                        type="password"
                        name="secondPassword"
                        placeholder="大小寫英文及數字且8碼以上"
                        className="block w-full mt-2 py-px px-1 sm:px-2 text-sm sm:text-lg border border-solid border-[#5458F7] rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-[100px] sm:w-[140px] mb-3 sm:mb-2 py-2 px-8 sm:px-12 self-center text-base font-normal text-white bg-[#5458F7] rounded-md"
                      disabled={isSubmitting}
                    >
                      {isLogin ? "登入" : "註冊"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
            <p className="text-sm sm:text-base font-medium">
              {isLogin ? "尚未成為會員?" : "已經是會員了?"}
              <span
                className="ml-1 text-[#5458F7]"
                role="button"
                onClick={() => handlePage()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Space") {
                    handlePage();
                  }
                }}
                tabIndex={0}
              >
                {isLogin ? "會員註冊" : "會員登入"}
              </span>
            </p>
          </main>
          <aside className="min-w-[10px] w-1/6 sm:w-2/6 bg-[#5458F7] rounded-r-2xl" />
        </div>
        <p className="mt-2 sm:mt-4 text-right text-xs sm:text-base font-normal text-gray-800">
          關於我們 · 隱私權條款 · Cookie 條款 · &copy; 2023 CanChu, Inc.
        </p>
      </div>
      {isLoading && (
        <div className="w-screen h-screen flex justify-center items-center fixed top-0 bg-white opacity-50 z-50">
          <p className="text-4xl sm:text-8xl font-bold text-black opacity-100">
            Loading...
          </p>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const token = getServerCookie("userInfo", "token", context.req);
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
