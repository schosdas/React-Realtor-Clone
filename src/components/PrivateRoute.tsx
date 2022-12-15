import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import GridLoader from "react-spinners/GridLoader";

// Router.tsx에서 사용
function PrivateRoute() {
  const { login, checking } = useAuthStatus();

  // 로그인 체크 완료 전에 return 되는 문제, 로딩 동안 대기하도록
  if (checking) {
    return <GridLoader color="#36d7b7" className=" fixed top-1/2 left-1/2" />;
  }

  // 로그인이 되어있다면 내부 route page, 안되어있다면 로그인 페이지로 이동
  return login ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
