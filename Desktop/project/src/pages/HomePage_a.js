import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { uploadPost } from "../api"; // uploadPost 함수가 ../api에서 export되어 있어야 합니다.

// QueryClient 인스턴스를 가져옵니다.
const queryClient = useQueryClient();

// uploadPostMutation 정의: 새로운 게시글 업로드 후, posts 쿼리를 무효화하고 토스트 알림을 표시합니다.
const uploadPostMutation = useMutation({
  mutationFn: (newPost) => uploadPost(newPost),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    toast("포스트가 성공적으로 업로드 되었습니다!");
  },
  onSettled: () => {
    console.log("onSettled in useMutation");
  },
});

// 새로운 게시글 업로드를 위한 핸들러 함수
const handleUploadPost = (newPost) => {
  uploadPostMutation.mutate(newPost, {
    onSuccess: () => {
      console.log("onSuccess in mutate");
    },
    onSettled: () => {
      console.log("onSettled in mutate");
    },
  });
};

// 예시 버튼: uploadPostMutation의 로딩 상태와 content가 있는지에 따라 버튼 활성화 여부를 결정합니다.
const content = "예시 게시글 내용"; // 실제 content는 state 등으로 관리하세요.


const {data: user}= useQuery({
    queryKey:['user', email],
    queryFn:getUserByEmail,
});

const userId = user?.id


const {
    data:project,
}=useQuery({
    queryKey:['projects', userId],
    queryFn:getProjectsByUser,
    enabled:!!userId,
})

function UploadButton() {
  return (
    <button disabled={uploadPostMutation.isLoading || !content} type="submit">
      업로드
    </button>
  );
}

// 위 코드를 원하는 컴포넌트 내에서 사용하면 됩니다.
export { uploadPostMutation, handleUploadPost, UploadButton };
