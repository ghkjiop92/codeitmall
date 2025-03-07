
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api";
import { uploadPostMutation } from "./HomePage_e";

const PAGE_LIMIT = 3;

function HomePage() {
  const [content, setContent] = useState("");
  const [page, setPage] = useState(0);

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts", page],
    queryFn: ({ pageParam }) => getPosts(pageParam ?? 0, PAGE_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
  });

  // Placeholder 변수 및 함수 (실제 구현 시 정의 필요)
  const currentUsername = ""; // 예: "codeit"
  const loginMessage = "";
  const handleLoginButtonClick = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
    // 업로드 로직을 구현하세요.
  };
  const handleInputChange = (e) => setContent(e.target.value);

  if (isLoading) return <div>로딩 중입니다...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  // useInfiniteQuery는 여러 페이지의 데이터를 pages 배열에 담습니다.
  // 각 페이지에서 결과 배열(results)을 추출하여 하나의 posts 배열로 만듭니다.
  const posts = postData?.pages.flatMap((page) => page.results) ?? [];

  return (
    <>
      <div>
        {currentUsername ? (
          loginMessage
        ) : (
          <button onClick={handleLoginButtonClick}>codeit으로 로그인</button>
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            name="content"
            value={content}
            onChange={handleInputChange}
          />
          <button disabled={uploadPostMutation.isLoading || !content} type="submit">
            업로드
          </button>
        </form>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.user.name}: {post.content}
          </li>
        ))}
      </ul>
      <div>
        <button
          disabled={page === 0}
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
        >
          &lt;
        </button>
        {/* 필요하면 "다음 페이지" 버튼 추가 */}
      </div>
    </>
  );
}

export default HomePage;
