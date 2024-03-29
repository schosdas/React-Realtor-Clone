import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditPost from "../pages/EditPost";
import Header from "../components/Header";
import PrivateRoute from "../components/PrivateRoute";
import CreatePost from "../pages/CreatePost";
import ForgetPassword from "../pages/ForgetPassword";
import HomePage from "../pages/Home";
import NotFound from "../pages/NotFound";
import Offers from "../pages/Offers";
import ProfilePage from "../pages/Profile";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";
import DetailPost from "../pages/DetailPost";
import Category from "../pages/Category";

function Router() {
  return (
    <BrowserRouter>
      {/* header, footer는 모든 페이지에서 보이도록 Routes 밖에서 사용 */}
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* 로그인이 필요한 페이지 처리 방법 */}
        {/* PrivateRoute 안에서 로그인 체크 및 Outlet을 통해 내부 Route 출력 */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/create-post" element={<PrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>

        <Route path="/edit-post/:postId" element={<PrivateRoute />}>
          <Route path="/edit-post/:postId" element={<EditPost />} />
        </Route>

        {/* 로그인 상태에서 로그인 페이지로 못가도록 */}
        <Route path="/sign-in" element={<PrivateRoute />}>
          <Route path="/sign-in" element={<SignInPage />} />
        </Route>
        <Route path="/sign-up" element={<PrivateRoute />}>
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>

        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/category/:category/:postId" element={<DetailPost />} />

        {/* 잘못된 경로, 404 Not Found  */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
