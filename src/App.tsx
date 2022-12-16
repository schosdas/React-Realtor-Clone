import React, { useEffect } from "react";
import Router from "./router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";
import { isLoadingState } from "./store/atom";
import GridLoader from "react-spinners/GridLoader";
import Loader from "./components/Loader";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <>
      <Router />
      {/* 모든 페이지에서 사용가능하도록 App에서 사용 */}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        limit={1} // 한 번에 표시될 토스트 수
        theme="dark"
      />

      {/* spinner loading  */}
      {isLoading && <Loader />}

      {/* react query 시각화를 위해 추가, 저장된 쿼리 데이터 확인 가능 */}
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
