import React, { useState } from "react";
import { useForm } from "react-hook-form";
import keyImage from "../images/key.jpg";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignButton from "../components/GoogleSignButton";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { COL_USERS } from "../constants/key";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { isLoadingAtom } from "../atom";
import { emailRegex, nicknameRegex, passwordRegex } from "../constants/regexp";
import CustomButton from "../components/CustomButton";

interface IFormData {
  nickname: string;
  email: string;
  password: string;
}

function SignUp() {
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

  // submit 후 호출, firebase email signup
  const onValid = async ({ nickname, email, password }: IFormData) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    // firebase auth, create firestore user doc
    // then-catch 보다 async-await, try-catch 가 좀 더 유용하다고 함
    try {
      setIsLoading(true); //loading

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;

      // update user profile, userCredential의 데이터 업데이트
      updateProfile(user, {
        displayName: nickname,
      });

      const userModel = {
        email: email,
        nickname: nickname,
        createDate: serverTimestamp(), // timestamp of firestore
      };

      // create user firestore (doc의 파라미터: firestore, col name, doc name)
      await setDoc(doc(db, COL_USERS, user.uid), userModel);
      // 완료 후 페이지 이동 등
      setIsLoading(false);
      toast.success("Sign up was successful");
      navigate("/");
    } catch (error: any) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      // 에러 종류 체크 (이메일 중복 등)
      switch (errorCode) {
        case "auth/email-already-in-use":
          return toast.error("Email already exists!");

        case "auth/internal-error":
          return toast.error("Unknown error! Please try next time");
      }
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
    <section className=" mt-6">
      {/* title */}
      <h1 className=" text-3xl text-center font-bold">Sign Up</h1>

      {/* image, form 부분을 반응형으로 row 또는 colum */}
      {/* flex wrap를 사용하면 내부 요소들이 박스 범위보다 크면 여러 행으로 나눠서 정렬 (세로 정렬) */}
      <div className="flex justify-center items-center flex-wrap w-full  px-6 py-12 max-w-6xl mx-auto">
        {/* image (이미지 오류 시 import로 불러오기) */}
        <div
          className=" md:import { UserCredential } from '../../node_modules/@firebase/auth/dist/src/model/public_types.d';
w-[67%] lg:w-[50%] md:mb-6 mb-12"
        >
          <img src={keyImage} alt="key" className="w-full rounded-2xl" />
        </div>

        {/* form, useForm 사용 */}
        <div className=" lg:w-[40%] md:w-[67%]  lg:ml-20">
          <form onSubmit={handleSubmit(onValid, inValid)}>
            {/* nickname */}
            <div className="mb-3">
              <input
                placeholder="Nickname"
                type="text"
                className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500"
                {...register("nickname", {
                  // 에러 메시지를 직접 입력 가능
                  required: { value: true, message: "닉네임을 입력해주세요" },
                  // 정규식
                  pattern: {
                    value: nicknameRegex,
                    message: "닉네임을 확인해주세요",
                  },
                })}
              ></input>
              {/* error text */}
              <span className="w-full text-xs text-red-500">
                {errors.nickname?.message}
              </span>
            </div>

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
                Have an account?
                <Link
                  to="/sign-in"
                  className=" ml-1 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                >
                  Sign In
                </Link>
              </p>
              <p className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
                <Link to="/forget-password">Forget password?</Link>
              </p>
            </div>

            <CustomButton type="submit">Sign Up</CustomButton>

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

export default SignUp;
