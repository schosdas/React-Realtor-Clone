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
import {
  COL_POSTS,
  DOC_CREATEDATE,
  DOC_OFFER,
  DOC_TYPE,
} from "../constants/key";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";

interface IPost {
  id: string;
  data: DocumentData; // any
}

function Home() {
  // firestore에서 카테고리별로 포스트 리스트 받아오기
  const [offers, setOffers] = useState<IPost[]>([]);
  const [rents, setRents] = useState<IPost[]>([]);
  const [sales, setSales] = useState<IPost[]>([]);

  const navigate = useNavigate();

  // ========================

  // useEffect fetch를 각 카테고리별로 만들기

  // fetch offer posts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const postRef = collection(db, COL_POSTS);
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
        // console.log("offerPosts: ", offerPosts);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchOffers();
  }, []);

  // fetch rent posts
  useEffect(() => {
    const fetchRents = async () => {
      try {
        const postRef = collection(db, COL_POSTS);
        const q = query(
          postRef,
          where(DOC_TYPE, "==", "rent"),
          orderBy(DOC_CREATEDATE, "desc"),
          limit(4)
        );

        const querySnapshot = await getDocs(q);

        // save doc list
        let rentPosts: any = [];
        querySnapshot.forEach((doc) => {
          return rentPosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setRents((prev) => rentPosts);
        // console.log("rentPosts: ", rentPosts);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchRents();
  }, []);

  // fetch sale posts
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const postRef = collection(db, COL_POSTS);
        const q = query(
          postRef,
          where(DOC_TYPE, "==", "sale"),
          orderBy(DOC_CREATEDATE, "desc"),
          limit(4)
        );

        const querySnapshot = await getDocs(q);

        // save doc list
        let salePosts: any = [];
        querySnapshot.forEach((doc) => {
          return salePosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setSales((prev) => salePosts);
        // console.log("salePosts: ", salePosts);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchSales();
  }, []);
  // ========================

  return (
    <>
      <header>
        <HomeSlider />
      </header>
      {/* 카테고리별 포스트 리스트 (카테고리별 4개) */}
      {/* 카테고리의 포스트가 있을 경우에만 출력 */}
      <main className="max-w-6xl mx-auto pt-4 space-y-6">
        {/* Offers */}
        {offers && offers.length > 0 ? (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>

            {/* all category page link */}
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>

            {/* 사이즈에 따라 4/2/1개 grid 출력 */}
            <ul className="sm:grid xl:grid-cols-4 sm:grid-cols-2   lg:grid-cols-3 ">
              {offers.map((post) => (
                <Post key={post.id} id={post.id} data={post.data} />
              ))}
            </ul>
          </div>
        ) : null}

        {/* Rents  */}
        {rents && rents.length > 0 ? (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Place for rent</h2>

            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>

            <ul className="sm:grid xl:grid-cols-4 sm:grid-cols-2   lg:grid-cols-3 ">
              {rents.map((post) => (
                <Post key={post.id} id={post.id} data={post.data} />
              ))}
            </ul>
          </div>
        ) : null}

        {/* Sales  */}
        {sales && sales.length > 0 ? (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Place for sale</h2>

            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>

            <ul className="sm:grid xl:grid-cols-4 sm:grid-cols-2   lg:grid-cols-3 ">
              {sales.map((post) => (
                <Post key={post.id} id={post.id} data={post.data} />
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </>
  );
}

export default Home;
