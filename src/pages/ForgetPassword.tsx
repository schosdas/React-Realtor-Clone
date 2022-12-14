import React from "react";
import { useForm } from "react-hook-form";
import keyImage from "../images/key.jpg";
import { Link } from "react-router-dom";
import GoogleSignButton from "../components/GoogleSignButton";

interface IFormData {
  email: string;
}

function Forgetpassword() {
  // 이메일/패스워드 정규식
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  // submit 후 호출, firebase email login
  const onValid = ({ email }: IFormData) => {
    console.log(email);
  };

  // submit 실패
  const inValid = (data: any) => {
    console.log("invalid: ", data);
  };

  return (
    <section className=" mt-6">
      {/* title */}
      <h1 className=" text-3xl text-center font-bold">Forget Password</h1>

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
                <Link to="/sign-in">Sign in instead</Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white uppercase rounded shadow-sm hover:bg-slate-400 hover:shadow-lg scale-105 duration-300"
            >
              Send reset email
            </button>

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

export default Forgetpassword;
