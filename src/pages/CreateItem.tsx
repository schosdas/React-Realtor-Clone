import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import {
  buttonCss,
  inputCss,
  numInputCss,
  textAreaCss,
} from "../constants/cssCode";

interface IItemFormData {
  type: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  description: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  latitude: number;
  longitude: number;
  images: object;
}

function CreateItem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  // toggle button values
  const [parking, setParking] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [offer, setOffer] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IItemFormData>({
    // 초기값 설정
    defaultValues: {
      type: "rent",
      name: "",
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: false,
      address: "",
      description: "",
      offer: false,
      regularPrice: 0,
      discountedPrice: 0,
      latitude: 0,
      longitude: 0,
      images: {},
    },
  });

  // ==========

  // functions
  const onValid = async ({ type }: IItemFormData) => {};
  const inValid = (data: any) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    console.log("invalid: ", data);
    toast.error("Form Valid Error!");
  };

  console.log(watch());

  // ==========

  return (
    <section className=" max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mt-6">Create a Item</h1>
      <div>
        <form onSubmit={handleSubmit(onValid, inValid)}>
          {/* Type */}
          <p className="mt-6 text-lg font-semibold">Sell / Rent</p>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setValue("type", "sell");
              }}
              {...(register("type"),
              {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`mr-6 ${buttonCss}  ${
                getValues("type") === "rent"
                  ? "bg-white text-black"
                  : "bg-slate-600 text-white"
              }`}
            >
              sell
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("type", "rent");
              }}
              {...(register("type"),
              {
                required: { value: true, message: "타입을 선택해주세요" },
              })}
              className={`${buttonCss} ${
                getValues("type") === "rent"
                  ? "bg-slate-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              rent
            </button>
          </div>

          {/* Name */}
          <p className="mt-6 text-lg font-semibold">Name</p>
          <input
            placeholder="Name"
            type="text"
            className={`${inputCss}`}
            {...register("name", {
              required: { value: true, message: "입력해주세요" },
              minLength: {
                value: 10,
                message: "10~32 사이의 글자를 입력해주세요",
              },
              maxLength: {
                value: 32,
                message: "10~32 사이의 글자를 입력해주세요",
              },
            })}
          />

          {/* Beds & Baths */}
          <div className="flex space-x-6 mb-6">
            <div>
              <p className="text-lg font-semibold">Beds</p>
              <input
                type="number"
                {...register("bedrooms", {
                  required: { value: true, message: "입력해주세요" },
                })}
                min="1"
                max="50"
                className={`${numInputCss}`}
              />
            </div>

            <div>
              <p className="text-lg font-semibold">Baths</p>
              <input
                type="number"
                {...register("bathrooms", {
                  required: { value: true, message: "입력해주세요" },
                })}
                min="1"
                max="50"
                className={`${numInputCss}`}
              />
            </div>
          </div>

          {/* Parking spot */}
          <p className="text-lg mt-6 font-semibold">Parking spot</p>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setValue("parking", true);
                setParking(true);
              }}
              {...register("parking", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`mr-6 ${buttonCss} ${
                // getValues("parking") === true
                parking ? "bg-slate-600 text-white" : "bg-white text-black"
              }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("parking", false);
                setParking(false);
              }}
              {...register("parking", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`${buttonCss} ${
                // getValues("parking") === true
                parking ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              no
            </button>
          </div>

          {/* Furnished */}
          <p className="text-lg mt-6 font-semibold">Furnished</p>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setValue("furnished", true);
                setFurnished(true);
              }}
              {...register("furnished", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`mr-6 ${buttonCss} ${
                // getValues("furnished") === true
                furnished ? "bg-slate-600 text-white" : "bg-white text-black"
              }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("furnished", false);
                setFurnished(false);
              }}
              {...register("furnished", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`${buttonCss} ${
                // getValues("furnished") === true
                furnished ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              no
            </button>
          </div>

          {/* Address */}
          <p className="text-lg mt-6 font-semibold">Address</p>
          <textarea
            placeholder="Address"
            {...register("address", {
              required: { value: true, message: "입력해주세요" },
            })}
            className={`${textAreaCss}`}
          />

          {/* Description */}
          <p className="text-lg mt-6 font-semibold">Description</p>
          <textarea
            placeholder="Description"
            {...register("description", {
              required: { value: true, message: "입력해주세요" },
            })}
            className={`${textAreaCss}`}
          />

          {/* Offer */}
          <p className="text-lg mt-6 font-semibold">Offer</p>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setValue("offer", true);
                setOffer(true);
              }}
              {...register("offer", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`mr-6 ${buttonCss} ${
                // getValues("offer") === true
                offer ? "bg-slate-600 text-white" : "bg-white text-black"
              }`}
            >
              Yes
            </button>

            <button
              type="button"
              onClick={() => {
                setValue("offer", false);
                setOffer(false);
              }}
              {...register("offer", {
                required: { value: true, message: "선택해주세요" },
              })}
              className={`${buttonCss} ${
                // getValues("offer") === true
                offer ? "bg-white text-black" : "bg-slate-600 text-white"
              }`}
            >
              no
            </button>
          </div>

          {/* Regular Price */}
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Regular price</p>
              <div className="w-full flex  justify-center items-center space-x-6">
                <input
                  type="number"
                  {...register("regularPrice", {
                    required: { value: true, message: "입력해주세요" },
                  })}
                  min="50"
                  max="400000000"
                  className={`${numInputCss}`}
                />
                {/* rent를 선택했을 경우 출력 */}
                {getValues("type") === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*  */}

          {/* Image */}

          {/* Submit Button */}
        </form>
      </div>
    </section>
  );
}

export default CreateItem;
