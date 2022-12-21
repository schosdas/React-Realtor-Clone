import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { COL_POSTS } from "../constants/key";
import { db } from "../firebase";
import DetailSlider from "../components/DetailSlider";

function DetailPost() {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [postData, setPostData] = useState<DocumentData>();

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
        <DetailSlider postImages={postData.images} />
      </header>
    </>
  );
}

export default DetailPost;
