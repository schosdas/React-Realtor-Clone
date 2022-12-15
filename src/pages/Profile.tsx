import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { doc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { isLoadingAtom } from "../atom";
import { emailRegex, nicknameRegex } from "../constants/regexp";
import CustomButton from "../components/CustomButton";
import { auth } from "../firebase";

interface IFormData {
  nickname: string;
  email: string;
}

function Profile() {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
  const [isEditMode, setIsEditMode] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormData>();

  // firestore에 저장된 유저 데이터 가져오기
  // useEffect(() => {
  //   // setValue를 사용하여 input value 채우기
  //   const nickname = auth.currentUser?.displayName;
  //   const email = auth.currentUser?.email;
  //   setValue("nickname", nickname!);
  //   setValue("email", email!);
  //   console.log(nickname, email);
  // }, []);

  const onValid = async ({ nickname, email }: IFormData) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    // firestore update

    // 완료 후
    toast.success("Update was successful");
    try {
      setIsLoading(true);
    } catch (error: any) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Update error");
    }
  };

  const inValid = (data: any) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    console.log("invalid: ", data);
    toast.error("Form Valid Error!");
  };

  return (
    <>
      <section className=" max-w-6xl mx-auto">
        {/* title */}
        <h1 className=" text-center text-3xl mt-6 font-bold">My Profile</h1>

        {/* form */}
        <div className="mt-6 px-3 md:w-[50%] w-full mx-auto">
          <form onSubmit={handleSubmit(onValid, inValid)}>
            {/* nickname */}
            <div className="mb-3">
              <input
                placeholder="Nickname"
                type="text"
                // 기본 disabled, edit mode일 때 제거
                disabled
                className={`w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none ${
                  isEditMode ? "hover:border-yellow-500" : ""
                }`}
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
            <div className="mb-6">
              <input
                placeholder="Email"
                type="text"
                // 기본 disabled, edit mode일 때 제거
                disabled
                className={`w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none ${
                  isEditMode ? "hover:border-yellow-500" : ""
                }`}
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
            <div className="mb-6 flex justify-between text-sm   whitespace-nowrap">
              <p className="flex items-center">
                Do want to change your name?
                <span className=" ml-1 text-red-500 hover:text-red-700 cursor-pointer transition duration-300 ease-in-out">
                  {isEditMode ? "Apply change" : "Edit"}
                </span>
              </p>

              <p className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300 ease-in-out">
                Sign out
              </p>
            </div>

            {/*  */}
            <div>
              <CustomButton type="submit">123</CustomButton>
            </div>
          </form>
        </div>
      </section>

      {/* my item lists */}
    </>
  );
}

export default Profile;
