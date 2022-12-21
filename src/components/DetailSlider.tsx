import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import {
  doc,
  getDoc,
  DocumentData,
  collection,
  orderBy,
  query,
  getDocs,
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
  postImages: [];
}

function DetailSlider({ postImages }: IPost) {
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  console.log(postImages);

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
      {postImages!.map((url: string, index: number) => (
        <SwiperSlide key={index}>
          {/* img 대신 background css로 출력 */}
          <div
            style={{
              background: `url(${postImages[index]}) center no-repeat`,
              backgroundSize: "cover",
            }}
            className="relative w-full h-[300px] overflow-hidden"
          ></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default DetailSlider;
