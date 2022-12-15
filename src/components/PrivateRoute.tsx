import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import GridLoader from "react-spinners/GridLoader";

// Router.tsx에서 사용
function PrivateRoute() {
  const { isLogin, checking } = useAuthStatus();
  const location = useLocation();
  const currentLocation = location.pathname;

  // 로그인 체크 완료 전에 return 되는 문제, 로딩 동안 대기하도록
  if (checking) {
    return <GridLoader color="#36d7b7" className=" fixed top-1/2 left-1/2" />;
  }

  /* 
  1. 로그인 X - 프로파일 페이지 접근 시 로그인 페이지로 이동 
  2. 로그인 O - 로그인/회원가입 페이지 접근 시 홈으로 이동
  */

  if (currentLocation === "/profile") {
    // 로그인이 되어있다면 내부 route page, 안되어있다면 로그인 페이지로 이동
    return isLogin ? <Outlet /> : <Navigate to="/sign-in" />;
  }
  // 로그인 상태일 때 로그인/회원가입 페이지 접근 금지
  else if (currentLocation === "/sign-in" || currentLocation === "/sign-up") {
    return isLogin ? <Navigate to="/" /> : <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}

export default PrivateRoute;
