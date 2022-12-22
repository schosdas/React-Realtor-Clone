import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import {
  DocumentData,
  collection,
  orderBy,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import { COL_POSTS, DOC_CREATEDATE } from "../constants/key";
import { db } from "../firebase";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";

interface IPost {
  id: string;
  data: DocumentData; // any
}

function HomeSlider() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);

    // 최신 포스트 최대 5개 가져오기
    const postRef = collection(db, COL_POSTS);
    const q = query(postRef, orderBy(DOC_CREATEDATE, "desc"), limit(5));

    const querySnapshot = await getDocs(q);

    // 각각의 post doc를 리스트에 저장
    let postList: any = [];
    querySnapshot.forEach((doc) => {
      return postList.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setPosts(postList);
    setIsLoading(false);
  };

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  //   console.log(postData);

  return (
    // 모든 포스트의 대표 이미지 출력, 클릭하여 해당 포스트로 이동
    <Swiper
      slidesPerView={1}
      navigation
      pagination={{ type: "progressbar" }}
      effect="fade"
      modules={[EffectFade]}
      autoplay={{ delay: 3000 }}
    >
      {posts!.map(({ data, id }: IPost) => (
        <SwiperSlide key={id}>
          {/* img 대신 background css로 출력 */}
          <div
            style={{
              background: `url(${data.images[0]}) center, no-repeat`,
              backgroundSize: "cover",
            }}
            // 해당 포스트의 페이지로 이동
            onClick={() => navigate(`/category/${data.type}/${id}`)}
            className="relative w-full h-[300px] overflow-hidden"
          ></div>

          {/* 포스트 제목 */}
          <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
            {data.name}
          </p>

          {/* 가격 (타입에 따라 내용 변경) */}
          <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
            ${data.discountedPrice ?? data.regularPrice}
            {data.type === "rent" && " / month"}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HomeSlider;
