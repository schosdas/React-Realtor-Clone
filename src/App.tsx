import React from "react";
import Router from "./router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilState } from "recoil";
import { isLoadingAtom } from "./atom";
import BeatLoader from "react-spinners/BeatLoader";

function App() {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);

  return (
    <>
      <Router />
      {/* 모든 페이지에서 사용가능하도록 App에서 사용 */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // pauseOnHover
        theme="dark"
      />

      {/* spinner loading  */}
      {isLoading && (
        <BeatLoader color="#36d7b7" className=" fixed top-1/2 left-1/2" />
      )}
    </>
  );
}

export default App;
