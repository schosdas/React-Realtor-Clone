import React from "react";
import { DocumentData } from "firebase/firestore";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

interface IProps {
  id: string;
  data: DocumentData; // any
  //  파라미터있는 함수를 props로 받는 방법
  onEdit: (value: string) => void;
  onDelete: (value: string) => void;
}

function Post({ id, data, onEdit, onDelete }: IProps) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      {/* detail page 이동, 첫번째 이미지 및 카드 컴포넌트 형태로 */}
      {/* 이미지의 사이즈를 위해 display-contents 사용 */}
      <Link className="contents" to={`/category/${data.type}/${id}`}>
        <img
          src={data.images[0]}
          alt=""
          loading="lazy"
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
        />
        {/* 시간 계산을 위한 moment 라이브러리 (경과 시간 출력 등), 이미지 구석에 위치 */}
        {/* absolute로 위치 조정을 위해 부모 태그를 relative로 만들기 */}
        <Moment
          fromNow
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-[10px] font-semibold rounded-md px-2 py-1 shadow-lg"
        >
          {data.createDate?.toDate()}
        </Moment>

        {/* content */}
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            {/* address */}
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {data.address}
            </p>
          </div>

          <p className="font-semibold m-0 text-xl truncate">{data.name}</p>

          {/* 금액에 , 단위 표시 방법 */}
          <p className="text-[#457b9d] mt-2 font-semibold">
            $
            {data.offer
              ? data.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : data.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {data.type === "rent" && " / month"}
          </p>

          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {data.bedrooms > 1 ? `${data.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>

            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {data.bathrooms > 1 ? `${data.bathrooms} Baths` : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 편집 및 삭제 아이콘 */}
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(data.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(data.id)}
        />
      )}
    </li>
  );
}

export default Post;
