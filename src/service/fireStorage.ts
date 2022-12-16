import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { v4 as uuid } from "uuid";

export const imageUpload = async (image: any) => {
  // promise 생성, resolve / reject : 성공, 실패를 반환, 비동기 처리할 때 사용?
  // resolve() 후 then 및 catch 사용 가능
  return new Promise((resolve, reject) => {
    // 경로 설정
    const filename = `${auth.currentUser?.uid}_${image.name}_${uuid()}`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // 진행, 일시 중지 및 재개와 같은 상태 변경 이벤트 관찰
        // 업로드된 바이트 수와 업로드할 총 바이트 수를 포함하여 작업 진행 상황을 가져옵니다.
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        // 에러 시 reject() 호출
        reject(error);
      },
      // Handle successful uploads on complete
      () => {
        // download url 반환
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
