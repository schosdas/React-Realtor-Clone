import React from "react";

interface IProps {
  type: any;
  children: React.ReactNode;
}

function CustomButton({ type, children }: IProps) {
  return (
    <button
      type={type}
      className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
    >
      {children}
    </button>
  );
}

export default CustomButton;
