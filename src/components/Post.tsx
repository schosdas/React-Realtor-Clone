import React from "react";
import { DocumentData } from "firebase/firestore";

interface IProps {
  id: string;
  data: DocumentData;
}

function Post({ id, data }: IProps) {
  return <div>Post</div>;
}

export default Post;
