import React, { useEffect, useState } from "react";
import HomeSlider from "../components/HomeSlider";
import {
  DocumentData,
  collection,
  orderBy,
  query,
  getDocs,
  limit,
  where,
} from "firebase/firestore";
import { COL_POSTS, DOC_CREATEDATE, DOC_OFFER } from "../constants/key";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";
import { toast } from "react-toastify";

interface IPost {
  id: string;
  data: DocumentData; // any
}

function Home() {
  // firestore에서 카테고리별로 포스트 리스트 받아오기
  const [offers, setOffers] = useState<IPost[]>([]);
  const [sales, setSales] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const postRef = collection(db, COL_POSTS);

    // fetch offer posts
    const fetchOffers = async () => {
      try {
        const q = query(
          postRef,
          where(DOC_OFFER, "==", true),
          orderBy(DOC_CREATEDATE, "desc"),
          limit(4)
        );

        const querySnapshot = await getDocs(q);

        // save doc list
        let offerPosts: any = [];
        querySnapshot.forEach((doc) => {
          return offerPosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setOffers((prev) => offerPosts);
        console.log(offerPosts);
      } catch (error: any) {
        console.log(error);
        toast.error("Failed get posts");
      }
    };

    fetchOffers();

    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <>
      <header>
        <HomeSlider />
      </header>
      {/* 카테고리별 포스트 리스트 (카테고리별 4개) */}
      {/* 카테고리 전체 보기 페이지 이동 등 */}
      <main className="max-w-6xl mx-auto pt-4 space-y-6">
        {/* Offers */}

        {/*  */}
      </main>
    </>
  );
}

export default Home;
