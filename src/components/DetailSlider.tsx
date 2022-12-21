import React, { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
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
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    // 2초 후 글자 제거
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  return (
    <>
      {/* 포스트의 이미지 출력, url 복사 등 */}
      <Swiper
        slidesPerView={1}
        // navigation 버튼 색상 수정을 위해 따로 css 수정해야함 (color option X)
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

      {/* url copy button */}
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={onCopy}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {/* copy 클릭 후 글자 출력 */}
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}
    </>
  );
}

export default DetailSlider;
