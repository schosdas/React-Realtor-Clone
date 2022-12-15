import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { isLoadingState } from "../store/atom";
import { nicknameRegex } from "../constants/regexp";
import CustomButton from "../components/CustomButton";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { COL_USERS, DOC_NICKNAME } from "../constants/key";

interface IFormData {
  nickname: string;
  email: string;
}

function Profile() {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormData>();

  // setValue를 사용하여 유저 정보를 input value에 입력
  useEffect(() => {
    setValue("nickname", auth.currentUser?.displayName ?? "");
    setValue("email", auth.currentUser?.email ?? "");
  }, []);

  const onValid = async ({ nickname, email }: IFormData) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    // 변경 사항이 없으면 넘어가기
    if (auth.currentUser?.displayName === nickname) {
      console.log("변경 사항 없음");
      setIsEditMode(false);
      return;
    }

    // apply 클릭으로도 가능하도록
    try {
      setIsLoading(true);
      // profile update
      await updateProfile(auth.currentUser!, {
        displayName: nickname,
      });

      // firestore update
      const docRef = doc(db, COL_USERS, auth.currentUser!.uid);
      await updateDoc(docRef, {
        DOC_NICKNAME: nickname,
      });

      // 완료 후
      setIsLoading(false);
      setIsEditMode(false);
      toast.success("Update success");
    } catch (error: any) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Update failed!");
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

  // input disable 제거
  const changeEditMode = () => {
    setIsEditMode(true);
  };

  const updateUserInfo = async () => {
    const nickname = getValues("nickname");

    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    // 변경 사항이 없으면 넘어가기
    if (auth.currentUser?.displayName === nickname) {
      console.log("변경 사항 없음");
      setIsEditMode(false);
      return;
    }

    try {
      setIsLoading(true);
      // profile update
      await updateProfile(auth.currentUser!, {
        displayName: nickname,
      });

      // firestore update

      // 완료 후
      setIsLoading(false);
      setIsEditMode(false);
      toast.success("Update success");
    } catch (error: any) {
      setIsLoading(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Update failed!");
    }
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
                // edit mode 상태에 따라 변경
                disabled={!isEditMode}
                className={`w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none
                ${isEditMode ? "bg-red-200" : ""}
                ${isEditMode ? "hover:border-yellow-500" : ""}`}
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

            {/* email, 수정 불가 */}
            <div className="mb-6">
              <input
                placeholder="Email"
                type="text"
                // edit mode 상태에 따라 변경
                disabled
                className={`w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none `}
                {...register("email")}
              ></input>
            </div>

            {/* change user info & logout */}
            <div className="mb-6 flex justify-between text-sm   whitespace-nowrap">
              <p className="flex items-center">
                Do want to change your name?
                <span
                  onClick={isEditMode ? updateUserInfo : changeEditMode}
                  className=" ml-1 text-red-500 hover:text-red-700 cursor-pointer transition duration-300 ease-in-out"
                >
                  {isEditMode ? "Apply change" : "Edit"}
                </span>
              </p>

              <p
                onClick={() => {
                  auth.signOut();
                  navigate("/");
                }}
                className="text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300 ease-in-out"
              >
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
