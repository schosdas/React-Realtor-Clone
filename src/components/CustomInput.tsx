import React, { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  // useform props로 받는 방법
  register?: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  placeholder: string;
}

function CustomInput({ register, type, placeholder }: IProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      className="w-full rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 transition duration-150 ease-in-out"
    />
  );
}

export default CustomInput;
