import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// custom hook, check login
function useAuthStatus() {
  const [login, setLogin] = useState(false);
  // 처음에 false로 만들면 PrivateRoute에서 로그인 체크 완료 전 return이 먼저되는 문제
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogin(true);
      } else {
        console.log("Not Login Yet");
        setLogin(false);
      }

      setChecking(false);
    });
  }, []);

  return { login, checking };
}

export default useAuthStatus;
