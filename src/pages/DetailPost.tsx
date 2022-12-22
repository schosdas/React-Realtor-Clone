import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { COL_POSTS } from "../constants/key";
import { auth, db } from "../firebase";
import DetailSlider from "../components/DetailSlider";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import ContactButton from "../components/ContactButton";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function DetailPost() {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [postData, setPostData] = useState<DocumentData>();
  const [isContact, setIsContact] = useState(false);

  useEffect(() => {
    // fetchPostData함수도 useEffect안에 같이 두는게 좋음?? (확인 필요)
    const fetchPostData = async () => {
      setIsLoading(true);

      const postId = params.postId; // url params

      // get doc data
      const postRef = doc(db, COL_POSTS, postId!);
      const snapshot = await getDoc(postRef);

      if (!snapshot.exists()) {
        setIsLoading(false);
        return toast.error("Failed get post data");
      }

      setPostData((prev) => snapshot.data());
      setIsLoading(false);
    };

    fetchPostData();
  }, [params.postId, setIsLoading]);

  if (!postData) return <></>;

  return (
    <>
      <header className="">
        {/* images slider */}
        <DetailSlider postImages={postData.images} />
      </header>

      <main className="m-4 flex max-w-6xl lg:mx-auto md:flex-row flex-col    p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        {/* detail post */}
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {/* 이름, 가격 (금액 단위로 변형) */}
            {postData.name} - ${" "}
            {postData.offer
              ? postData.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : postData.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {postData.type === "rent" ? " / month" : ""}
          </p>
          {/* address */}
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {postData.address}
          </p>

          {/* type */}
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {postData.type === "rent" ? "Rent" : "Sale"}
            </p>

            {/* offer 선택되었을 경우, 할인율 출력  */}
            {postData.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ${+postData.regularPrice - +postData.discountedPrice} discount
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {postData.description}
          </p>

          {/* bed, bathrooms 등 */}
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+postData.bedrooms > 1 ? `${postData.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+postData.bathrooms > 1
                ? `${postData.bathrooms} Baths`
                : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {postData.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {postData.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>

          {/* contact - send message to email */}
          {/* 나의 포스트가 아닐 경우에만 */}
          {postData.uid !== auth.currentUser?.uid && !isContact ? (
            <div className="mt-10">
              <button
                onClick={() => setIsContact((prev) => true)}
                className="w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm  rounded shadow-md hover:bg-blue-700 uppercase hover:shadow-lg focus:bg-blue-700 focus:shadow-lg  text-center transition duration-150 ease-in-out "
              >
                Contact Landlord
              </button>
            </div>
          ) : null}
          {/* Contact 클릭 후 메시지 입력 및 전송 창 */}
          {isContact && (
            <ContactButton postHostId={postData.uid} postData={postData} />
          )}
        </div>

        {/* google map */}
        <div className="w-full md:h-[400px] h-[200px] z-10 overflow-x-hidden md:mt-0  md:ml-2 mt-6 ">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>{postData.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>
    </>
  );
}

export default DetailPost;
