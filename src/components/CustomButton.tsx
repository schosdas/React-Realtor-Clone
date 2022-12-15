import React from "react";

interface IProps {
  type: any;
  text: string;
}

function CustomButton({ type, text }: IProps) {
  return (
    <button
      type={type}
      className="w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white uppercase rounded shadow-sm hover:bg-slate-400 hover:shadow-lg scale-105 duration-300"
    >
      {text}
    </button>
  );
}

export default CustomButton;
