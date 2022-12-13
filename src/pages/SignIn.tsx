import React, { useState } from "react";
import { useForm } from "react-hook-form";
import keyImage from "../images/key.jpg";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

interface IFormData {
  email: string;
  password: string;
}

function SignIn() {
  const [showingPassword, setShowingPassword] = useState(false);
  // 이메일/패스워드 정규식
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  // 숫자, 영문자, 특수문자 8글자 이상
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  // submit 후 호출
  const onValid = ({ email, password }: IFormData) => {
    console.log(email, password);
  };

  // submit 실패
  const inValid = (data: any) => {
    console.log("invalid: ", data);
  };

  // password hide toggle
  const toggleHide = () => {
    setShowingPassword((prev) => !prev);
  };

  return (
    <section className=" mt-6">
      {/* title */}
      <h1 className=" text-3xl text-center font-bold">Sign In</h1>

      {/* image, form 부분을 반응형으로 row 또는 colum */}
      {/* flex wrap를 사용하면 내부 요소들이 박스 범위보다 크면 여러 행으로 나눠서 정렬 (세로 정렬) */}
      <div className="flex justify-center items-center flex-wrap w-full  px-6 py-12 max-w-6xl mx-auto">
        {/* image (이미지 오류 시 import로 불러오기) */}
        <div className=" md:w-[67%] lg:w-[50%] md:mb-6 mb-12">
          <img src={keyImage} alt="key" className="w-full rounded-2xl" />
        </div>

        {/* form, useForm 사용 */}
        <div className=" lg:w-[40%] md:w-[67%]  lg:ml-20">
          <form onSubmit={handleSubmit(onValid, inValid)}>
            {/* email */}
            <input
              placeholder="Email"
              type="text"
              className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 mb-1"
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
            <span className="w-full text-xs text-red-500 mb-5">
              {errors.email?.message}
            </span>

            {/* password, 아이콘 배치를 위해 relative로 만들고 아이콘은 absolute */}
            <div className=" relative">
              <input
                placeholder="Password"
                type={showingPassword ? "text" : "password"} // 패스워드 보이기/감추기
                className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 mb-1"
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
                  className=" absolute right-3 top-4"
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={toggleHide}
                  className=" absolute right-3 top-4"
                />
              )}
            </div>
            {/* error text */}
            <span className=" text-xs text-red-500 mb-5">
              {errors.password?.message}
            </span>

            {/* 그라데이션 효과 등 */}
            <button
              type="submit"
              className="w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
