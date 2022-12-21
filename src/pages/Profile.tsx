import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { isLoadingState } from "../store/atom";
import { nicknameRegex } from "../constants/regexp";
import CustomButton from "../components/CustomButton";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
  COL_POSTS,
  COL_USERS,
  DOC_CREATEDATE,
  DOC_UID,
} from "../constants/key";
import { FcHome } from "react-icons/fc";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import Post from "../components/Post";

interface IFormData {
  nickname: string;
  email: string;
}

interface IPost {
  id: string;
  data: DocumentData; // any
}

function Profile() {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormData>();

  // setValue를 사용하여 유저 정보를 input value에 입력, my lists 불러오기
  useEffect(() => {
    // get nickname
    setValue("nickname", auth.currentUser?.displayName ?? "");
    setValue("email", auth.currentUser?.email ?? "");
    // fetch user posts
    fetchUserPosts();
  }, [auth.currentUser?.uid]);

  const fetchUserPosts = async () => {
    setIsLoading(true);

    // search query, 시간 정렬 및 새로운 데이터가 위로 오도록 역정렬
    const postRef = collection(db, COL_POSTS);
    const q = query(
      postRef,
      where(DOC_UID, "==", auth.currentUser?.uid),
      orderBy(DOC_CREATEDATE, "desc")
    );

    const querySnapshot = await getDocs(q);

    // 각각의 post doc를 리스트에 저장
    let postList: any = [];
    querySnapshot.forEach((doc) => {
      return postList.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setPosts(postList);
    setIsLoading(false);
  };

  const onValid = async ({ nickname }: IFormData) => {
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
        nickname: nickname,
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

      // todo firestore update

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

  // 포스트 편집, 삭제
  const onEdit = (postId: string) => {
    // 편집 페이지 이동
    navigate(`/edit-post/${postId}`);
  };

  const onDelete = async (postId: string) => {
    // window popup
    if (window.confirm("Are you sure delete this post?")) {
      // firestore doc delete
      const postRef = doc(db, COL_POSTS, postId);
      await deleteDoc(postRef);
      // after delete, updating post list
      // id를 비교하여 삭제된 포스트 외 나머지 리스트 저장
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      toast.success("Successfully delete post");
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
          </form>

          {/* Post Create Button  */}
          <div>
            <CustomButton type="submit">
              <Link
                to="/create-post"
                className="flex justify-center items-center"
              >
                <FcHome className="mr-3 text-3xl bg-red-200 border-2 rounded-full p-1" />{" "}
                sell or rent your home
              </Link>
            </CustomButton>
          </div>
        </div>
      </section>

      {/* my post lists */}
      {/* fetch 완료 후 출력, 화면 사이즈에 따라 grid 개수 변경 */}
      {!isLoading && posts.length > 0 ? (
        <section className=" max-w-6xl mx-auto mt-6 px-3">
          <h2 className=" text-2xl text-center font-semibold">My List</h2>
          {/* grid 생성 방법 */}
          <ul className=" grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 my-6 ">
            {posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                data={post.data}
                onDelete={() => onDelete(post.id)}
                onEdit={() => onEdit(post.id)}
              />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

export default Profile;
