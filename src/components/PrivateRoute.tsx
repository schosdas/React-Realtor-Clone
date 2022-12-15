import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const [isLogin, setIsLogin] = useState(false);

  // Router.tsx
  // 로그인이 되어있다면 내부 route page, 안되어있다면 로그인 페이지로 이동
  return isLogin ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
