import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import ForgetPassword from "../pages/ForgetPassword";
import HomePage from "../pages/Home";
import Offers from "../pages/Offers";
import ProfilePage from "../pages/Profile";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";

function Router() {
  return (
    <BrowserRouter>
      {/* header, footer는 모든 페이지에서 보이도록 Routes 밖에서 사용 */}
      <Header />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
          // errorElement={<ErrorScreen />} // 에러 시 출력, api 오류 등은 따로 처리해야함
        ></Route>

        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/sign-in" element={<SignInPage />}></Route>
        <Route path="/sign-up" element={<SignUpPage />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route path="/offers" element={<Offers />}></Route>

        {/* /* 를 사용하면 해당 라우트에서 nested route를 사용한다는 의미 (탭 화면 등) */}
        {/* <Route
      path="/detail/:coinId/*"
      element={<CoinScreen />}
      errorElement={<ErrorScreen />}
    ></Route> */}

        {/* 잘못된 경로, 404 Not Found  */}
        {/* <Route path="*" element={<NotFound />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;