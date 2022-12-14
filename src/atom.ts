import { atom } from "recoil";

// 상태관리를 위한 atom 생성 방법
export const isLoadingAtom = atom({
  key: "isLoading",
  default: false,
});
