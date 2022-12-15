import React, { useState } from "react";
import { useForm } from "react-hook-form";
import keyImage from "../images/key.jpg";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignButton from "../components/GoogleSignButton";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { isLoadingAtom } from "../atom";
import { useRecoilState } from "recoil";
import { emailRegex, passwordRegex } from "../constants/regexp";
import CustomButton from "../components/CustomButton";

interface IFormData {
  email: string;
  password: string;
}

function SignIn() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
  const [showingPassword, setShowingPassword] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  // submit 후 호출, firebase email login
  const onValid = async ({ email, password }: IFormData) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true); // loading

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 완료 후 페이지 이동 등
      setIsLoading(false);
      toast.success("Sign in was successful");
      navigate("/");
    } catch (error: any) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Login error!");
    }
  };

  // submit 실패
  const inValid = (data: any) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    console.log("invalid: ", data);
    toast.error("Form Valid Error!");
  };

  // password hide toggle
  const toggleHide = () => {
    setShowingPassword((prev) => !prev);
  };

  return (
    <section>
      {/* title */}
      <h1 className="mt-6 text-3xl text-center font-bold">Sign In</h1>

      {/* image, form 부분을 반응형으로 row 또는 colum */}
      {/* flex wrap를 사용하면 내부 요소들이 박스 범위보다 크면 여러 행으로 나눠서 정렬 (세로 정렬) */}
      <div className="flex justify-center items-center flex-wrap w-full  px-6 py-12 max-w-6xl mx-auto">
        {/* image (이미지 오류 시 import로 불러오기) */}
        <div
          className=" md:import BeatLoader from '../../node_modules/react-spinners/umd/BeatLoader.d';
w-[67%] lg:w-[50%] md:mb-import { type } from '../../node_modules/@remix-run/router/dist/index.d';
6 mb-12"
        >
          <img src={keyImage} alt="key" className="w-full rounded-2xl" />
        </div>

        {/* form, useForm 사용 */}
        <div className=" lg:w-[40%] md:w-[67%]  lg:ml-20">
          <form onSubmit={handleSubmit(onValid, inValid)}>
            {/* email */}
            <div className="mb-3">
              <input
                placeholder="Email"
                type="text"
                className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
                {...register("email", {
                  // 에러 메시지를 직접 입력 가능
                  required: { value: true, message: "이메일을 입력해주세요" },
                  // 정규식
                  pattern: {
                    value: emailRegex,
                    message: "이메일을 확인해주세요",
                  },
                })}
              ></input>
              {/* error text */}
              <span className="w-full text-xs text-red-500">
                {errors.email?.message}
              </span>
            </div>

            {/* password, 아이콘 배치를 위해 relative로 만들고 아이콘은 absolute */}
            <div className=" relative mb-3">
              <input
                placeholder="Password"
                type={showingPassword ? "text" : "password"} // 패스워드 보이기/감추기
                className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 "
                {...register("password", {
                  // 에러 메시지를 직접 입력 가능
                  required: { value: true, message: "비밀번호를 입력해주세요" },
                  // 정규식
                  pattern: {
                    value: passwordRegex,
                    message:
                      "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요",
                  },
                })}
              ></input>
              {/* hide toggle */}
              {showingPassword ? (
                <AiFillEye
                  onClick={toggleHide}
                  className=" absolute right-3 top-4 cursor-pointer text-lg"
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={toggleHide}
                  className=" absolute right-3 top-4 cursor-pointer text-lg"
                />
              )}
              {/* error text */}
              <span className=" text-xs text-red-500">
                {errors.password?.message}
              </span>
            </div>

            {/* forget password, sign up links */}
            <div className="mb-5 flex justify-between text-sm">
              <p className="">
                Don't have a account?
                <Link
                  to="/sign-up"
                  className=" ml-1 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                >
                  Resister
                </Link>
              </p>
              <p className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
                <Link to="/forget-password">Forget password?</Link>
              </p>
            </div>

            <CustomButton type="submit">Sign In</CustomButton>

            {/* custom dividid line */}
            {/* before, after를 사용하여 앞과 뒤에 내용 추가 가능 */}
            <div
              className="my-4 flex items-center 
              before:border-t before:flex-1  before:border-gray-300 
              after:border-t after:flex-1 after:border-gray-300"
            >
              <p className=" text-center font-semibold mx-4">OR</p>
            </div>

            {/* 구글 로그인 버튼 */}
            <GoogleSignButton />
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
