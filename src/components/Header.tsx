import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  const currentLocation = location.pathname;
  console.log(currentLocation);

  // login check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
      } else {
        console.log("Not Login Yet");
        setIsLogin(false);
      }
    });
  }, []);

  return (
    <div className=" bg-white shadow-sm border-b sticky top-0 z-50">
      <header className=" max-w-6xl m-auto py-3 px-5 flex justify-between items-center">
        {/* logo */}
        <div>
          <Link to="/">
            <img
              src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
              alt="logo"
              className="h-5 "
            />
          </Link>
        </div>

        {/* nav items */}
        <div>
          {/* []안에 값 입력하여 커스텀 css, className에서 조건문 사용 방법 */}
          <ul className="flex space-x-10">
            <Link to="/">
              <li
                className={`text-sm font-semibold py-3 hover:text-red-500   border-b-[3px]  ${
                  currentLocation === "/"
                    ? "border-b-red-500"
                    : "text-gray-400 border-b-transparent"
                } `}
              >
                Home
              </li>
            </Link>

            <Link to="/offers">
              <li
                className={`text-sm font-semibold py-3 hover:text-red-500   border-b-[3px]  ${
                  currentLocation === "/offers"
                    ? "border-b-red-500"
                    : "text-gray-400 border-b-transparent"
                } `}
              >
                Offers
              </li>
            </Link>

            {/* 로그인 상태에 따라 로그인 or 프로필 */}
            <Link to={isLogin ? `/profile` : `/sign-in`}>
              <li
                className={`text-sm font-semibold py-3 hover:text-red-500   border-b-[3px]  ${
                  currentLocation === "/sign-in" ||
                  currentLocation === "/profile"
                    ? "border-b-red-500"
                    : "text-gray-400 border-b-transparent"
                } `}
              >
                {isLogin ? `Profile` : `Sign In`}
              </li>
            </Link>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
