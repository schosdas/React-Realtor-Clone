import React, { useEffect, useState } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { COL_USERS } from "../constants/key";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IProps {
  postHostId: any;
  postData: DocumentData;
}

interface IMessage {
  message: string;
}

function ContactButton({ postHostId, postData }: IProps) {
  const [landlordData, setLandlordData] = useState<DocumentData>();
  const [text, setText] = useState("");

  const { register, watch } = useForm<IMessage>();

  // 포스트 호스트 유저 데이터 얻기
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, COL_USERS, postHostId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists) {
        return toast.error("Failed get landlord data");
      }

      setLandlordData((prev) => snapshot.data());
      console.log(snapshot.data());
    };

    getLandlord();
  }, [postHostId]);

  useEffect(() => {
    // console.log("message: ", text);
  }, [text]);

  if (!landlordData) return <></>;

  return (
    <>
      <div className="flex flex-col w-full">
        <p>
          Contact{" "}
          <span className=" text-blue-400">{landlordData.nickname}</span> for
          the <span className=" text-blue-400">{postData.name}</span>
        </p>
        <div className="mt-3 mb-6">
          {/* input message */}
          <textarea
            {...(register("message"),
            {
              // onChange 직접 적용
              onChange: (e) => {
                setText(() => e.target.value);
              },
            })}
            placeholder="Message"
            rows={2}
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
          ></textarea>
        </div>

        {/* 메일 보내는 방법 */}
        <a
          href={`mailto:${landlordData.email}?Subject=${postData.name}&body=${text}`}
        >
          <button
            type="button"
            className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
          >
            Send Message
          </button>
        </a>
      </div>
    </>
  );
}

export default ContactButton;
