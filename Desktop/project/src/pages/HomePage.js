import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPosts } from "../api";

// 임시 uploadPost 함수 (옵션 2)
// 나중에 ../api에서 uploadPost를 export하도록 수정하면 아래 코드는 삭제합니다.
async function uploadPost(newPost) {
  const response = await fetch("http://localhost:3090/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) {
    throw new Error("Post upload failed");
  }
  return response.json();
}

function HomePage() {
  const [content, setContent] = React.useState("");

  const { data: postData, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    retry: 0,
  });

  const uploadPostMutation = useMutation({
    mutationFn: (newPost) => uploadPost(newPost),
    onSuccess: () => {
      // 성공 시 리패칭 또는 다른 후처리 로직 추가 가능
    },
  });

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { username: "codeit", content };
    uploadPostMutation.mutate(newPost);
    setContent("");
  };

  if (isLoading) return <div>로딩 중입니다....</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  const posts = postData?.results ?? [];

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <textarea
            name="content"
            value={content}
            onChange={handleInputChange}
          />
          <button disabled={!content} type="submit">
            업로드
          </button>
        </form>
      </div>
      <div>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.user?.name}: {post.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
