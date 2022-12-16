import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import { buttonCss, numInputCss, textAreaCss } from "../constants/cssCode";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import Geocode from "react-geocode";
import Postcode from "react-daum-postcode";
import { imageUpload } from "../service/fireStorage";
import {
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import { COL_ITEMS, COL_USERS } from "../constants/key";

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
  const [isOpenPost, setIsOpenPost] = useState(false);
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
      regularPrice: 50,
      discountedPrice: 0,
      latitude: 0,
      longitude: 0,
      images: {},
    },
  });

  // ==========

  // functions
  const onValid = async (formData: IItemFormData) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    /*
    errors
    1. discountedPrice가 regularPrice보다 클경우 
    2. 이미지가 6장보다 많을 경우
     */

    if (formData.discountedPrice > formData.regularPrice) {
      setIsLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    // 이미지 오브젝트를 리스트로 변환
    let imagesLength = Object.entries(formData.images).length;

    if (imagesLength > 6) {
      setIsLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }

    // geolocation, google map api
    // react-geo 라이브러리 사용
    try {
      Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY!);
      Geocode.setLanguage("ko");
      Geocode.setRegion("es");
      Geocode.enableDebug();

      const response = await Geocode.fromAddress(formData.address);
      // 주소 위도/경도 변환
      const { lat, lng } = response.results[0].geometry.location;
      console.log(lat, lng);

      // setValue("latitude", lat);
      // setValue("longitude", lng);

      // ========
      // Storage & get urls
      // async-await 사용을 위해 Promise로 만들기?
      // images 타입 에러 때문에 as [] 추가!
      const imgUrls = await Promise.all(
        [...(formData.images as [])].map((image) => imageUpload(image))
      ).catch((error) => {
        setIsLoading(false);
        toast.error("Images not uploaded");
        return;
      });

      console.log("urls: ", imgUrls);

      // ========
      // todo create firestore
      // 입력한 폼과 download urls을 업로드하기
      const itemModel = {
        // 폼데이터를 그대로 가져오고 이미지값 변경 및 추가 등
        ...formData,
        latitude: lat,
        longitude: lng,
        images: imgUrls,
        createDate: serverTimestamp(),
      };

      console.log("itemModel: ", itemModel);

      // 특정 문서 id를 지정할 때는 setDoc, 자동으로 새로 생성할 때는 addDoc
      const docRef = await addDoc(collection(db, COL_ITEMS), itemModel);

      // 완료 후 생성된 디테일 페이지 이동 등
      setIsLoading(false);
      toast.success("Create item was successful");
      navigate(`/category/${itemModel.type}/${docRef.id}`);
    } catch (error: any) {
      setIsLoading(false);

      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      toast.error("Create error");
      return;
    }
  };

  const inValid = (data: any) => {
    // 중복 클릭 방지
    if (isLoading) {
      return;
    }
    setIsLoading(false);
    console.log("invalid: ", data);
    toast.error("Form Valid Error!");
  };

  // 카카오 주소 검색 결과
  const onCompletePost = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(`주소: ${fullAddress}`);

    setValue("address", fullAddress);
    setIsOpenPost(false);
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
                // required: { value: true, message: "선택해주세요" },
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
                // required: { value: true, message: "타입을 선택해주세요" },
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
          <CustomInput
            placeholder="Name"
            type="text"
            register={register("name", {
              required: { value: true, message: "입력해주세요" },
              minLength: {
                value: 6,
                message: "6~32 사이의 글자를 입력해주세요",
              },
              maxLength: {
                value: 32,
                message: "10~32 사이의 글자를 입력해주세요",
              },
            })}
          />

          {/* Beds & Baths */}
          <div className="flex space-x-6 mt-6">
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
                // required: { value: true, message: "선택해주세요" },
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
                // required: { value: true, message: "선택해주세요" },
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
                // required: { value: true, message: "선택해주세요" },
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
                // required: { value: true, message: "선택해주세요" },
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
          {/* 다음 주소 검색으로 변경 */}
          <p className="text-lg mt-6 font-semibold">Address</p>
          <div className="flex space-x-2">
            <CustomInput
              disabled
              register={register("address", {
                required: { value: true, message: "입력해주세요" },
              })}
            />

            <button
              type="button"
              onClick={() => {
                setIsOpenPost((prev) => !prev);
              }}
              className=" whitespace-nowrap p-2 bg-blue-600 text-white text-[2px] font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
            >
              주소검색
            </button>
          </div>

          {/* 주소 검색 API 팝업 */}
          {isOpenPost ? (
            <div className=" fixed block top-[20%]  w-[400px] h-[400px] p-2">
              <button
                onClick={() => {
                  setIsOpenPost(false);
                }}
                className=" whitespace-nowrap p-2 bg-blue-600 text-white text-[2px] font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              >
                Close
              </button>

              <Postcode
                className=" "
                autoClose
                onComplete={onCompletePost}
                onClose={() => {
                  setIsOpenPost(false);
                }}
              />
            </div>
          ) : null}

          {/* Description */}
          <p className="text-lg font-semibold mt-6">Description</p>
          <textarea
            placeholder="Description"
            {...register("description", {
              required: { value: true, message: "입력해주세요" },
            })}
            className={`${textAreaCss}`}
          />

          {/* Offer */}
          <p className="text-lg font-semibold">Offer</p>
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setValue("offer", true);
                setOffer(true);
              }}
              {...register("offer", {
                // required: { value: true, message: "선택해주세요" },
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
                // required: { value: true, message: "선택해주세요" },
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
          <div className="flex items-center mt-6">
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
                {/* rent를 선택했을 경우 옆에 출력 */}
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

          {/* Discounted Price, offer을 선택했을때 출력 */}
          {offer && (
            <div className="flex items-center mt-6">
              <div className="">
                <p className="text-lg font-semibold">Discounted price</p>
                <div className="flex w-full justify-center items-center space-x-6">
                  <input
                    type="number"
                    {...register("discountedPrice", {
                      required: { value: true, message: "입력해주세요" },
                    })}
                    min="50"
                    max="400000000"
                    required={offer}
                    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                  />
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
          )}

          {/* Image */}
          <div className="mt-6">
            <p className="text-lg font-semibold">Images</p>
            <p className="text-gray-600">
              The first image will be the cover (max 6)
            </p>
            {/* 불러온 file info를 images에 저장, 한 번에 여러 파일 선택 */}
            <input
              type="file"
              accept=".jpg,.png,.jpeg" // image file
              multiple
              {...register("images", {
                required: { value: true, message: "입력해주세요" },
              })}
              className="w-full px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 focus:bg-white focus:border-slate-600 rounded transition duration-150 ease-in-out "
            />
          </div>

          {/* Submit Button */}
          <div className="my-10">
            <CustomButton type="submit">create item</CustomButton>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateItem;
