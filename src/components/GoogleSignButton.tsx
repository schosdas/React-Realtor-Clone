import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { COL_USERS } from "../key";

function GoogleSignButton() {
  const navigate = useNavigate();

  // firebase google login
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      auth.languageCode = "kr"; // 언어 변경 옵션

      // google login popup
      const result = await signInWithPopup(auth, provider);
      // get token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      const user = result.user;

      // user model
      const email = user.email;
      const splitEmail = user.email?.split("@");
      const nickname = splitEmail![0];

      const userModel = {
        email: email,
        nickname: nickname,
        createDate: serverTimestamp(), // timestamp of firestore
      };

      // 데이터베이스에 이미 있는지 체크하고 없으면 유저 db 생성
      const docRef = doc(db, COL_USERS, user.uid);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, userModel);
      }

      // 완료 후 페이지 이동
      toast.success("Sign in was successful");
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Google sign error!");
    }
  };

  return (
    <button
      type="button"
      onClick={googleSignIn}
      className="w-full flex items-center justify-center uppercase rounded  bg-red-700 text-white p-2 scale-105  hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-300 ease-in-out "
    >
      <FcGoogle className="text-2xl   bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}

export default GoogleSignButton;
