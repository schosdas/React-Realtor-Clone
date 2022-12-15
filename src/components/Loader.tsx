import React from "react";
import GridLoader from "react-spinners/GridLoader";

function Loader() {
  return (
    <div className="bg-black opacity-30 flex items-center  justify-center fixed left-0 right-0 bottom-0 top-0 z-50 ">
      <GridLoader color="#36d7b7" />
    </div>
  );
}

export default Loader;
