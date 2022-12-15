import React, { useEffect } from "react";
import Router from "./router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";
import { isLoadingState } from "./store/atom";
import GridLoader from "react-spinners/GridLoader";

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
        theme="dark"
      />

      {/* spinner loading  */}
      {isLoading && (
        <GridLoader color="#36d7b7" className=" fixed top-1/2 left-1/2" />
      )}
    </>
  );
}

export default App;
