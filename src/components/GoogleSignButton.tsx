import React from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleSignButton() {
  // firebase google login
  const googleSignIn = () => {};

  return (
    <button
      type="button"
      onClick={googleSignIn}
      className="w-full flex items-center justify-center rounded  bg-red-700 text-white p-2 scale-105  hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-300 ease-in-out "
    >
      <FcGoogle className="text-2xl  bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}

export default GoogleSignButton;
