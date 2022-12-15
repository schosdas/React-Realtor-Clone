import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";

// 중복되는 css
const buttonCss =
  "px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full";

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

  const selectType = (type: string) => {
    setValue("type", type);
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
                selectType("sell");
              }}
              {...(register("type"),
              {
                required: true,
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
                selectType("rent");
              }}
              {...(register("type"),
              {
                required: true,
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

          {/* Beds & Baths */}

          {/* Parking spot */}

          {/* Furnished */}

          {/* Address */}

          {/* Description */}

          {/* Offer */}

          {/* Regular Price */}

          {/* Image */}

          {/* Submit Button */}
        </form>
      </div>
    </section>
  );
}

export default CreateItem;
