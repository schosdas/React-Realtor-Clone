import React, { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  orderBy,
  query,
  getDocs,
  limit,
  where,
  startAfter,
} from "firebase/firestore";
import {
  COL_POSTS,
  DOC_CREATEDATE,
  DOC_OFFER,
  DOC_TYPE,
} from "../constants/key";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../store/atom";
import { toast } from "react-toastify";
import Post from "../components/Post";

interface IPost {
  id: string;
  data: DocumentData; // any
}

function Offers() {
  const [offers, setOffers] = useState<IPost[]>([]);
  const [lastFetchedPost, setLastFetchedPost] = useState<DocumentData>();
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  // fetch offer posts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const postRef = collection(db, COL_POSTS);
        const q = query(
          postRef,
          where(DOC_OFFER, "==", true),
          orderBy(DOC_CREATEDATE, "desc"),
          limit(8)
        );

        const querySnapshot = await getDocs(q);
        // 마지막 패치 데이터 저장
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedPost(lastVisible);

        // save doc list
        let offerPosts: any = [];
        querySnapshot.forEach((doc) => {
          return offerPosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setOffers((prev) => offerPosts);
        setIsLoading(false);
        // console.log("offerPosts: ", offerPosts);
      } catch (error: any) {
        setIsLoading(false);
        console.log(error);
        toast.error("Could not fetch posting");
      }
    };

    fetchOffers();
  }, [setIsLoading]);

  // get more fetching post
  const onFetchMorePosts = async () => {
    try {
      setIsLoading(true);
      const postRef = collection(db, COL_POSTS);
      const q = query(
        postRef,
        where(DOC_OFFER, "==", true),
        orderBy(DOC_CREATEDATE, "desc"),
        // 마지막 패치 이후의 데이터 가져오기
        startAfter(lastFetchedPost),
        limit(4)
      );

      const querySnapshot = await getDocs(q);
      // 마지막 패치 데이터 저장
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedPost(lastVisible);

      // update doc list
      let offerPosts: any = [];
      querySnapshot.forEach((doc) => {
        return offerPosts.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // 새로운 데이터들을 리스트에 추가
      setOffers((prevList) => [...prevList, ...offerPosts]);
      // console.log("offerPosts: ", offerPosts);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      toast.error("Could not fetch posting");
    }
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center font-bold  my-6">Offers</h1>

      {offers.length === 0 ? (
        <p>There are no current offers</p>
      ) : (
        <main>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {offers.map((post) => (
              <Post key={post.id} id={post.id} data={post.data} />
            ))}
          </ul>
        </main>
      )}

      {lastFetchedPost && (
        <div className="flex justify-center items-center">
          <button
            onClick={onFetchMorePosts}
            className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

export default Offers;
