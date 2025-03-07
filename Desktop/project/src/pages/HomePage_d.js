import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, uploadPost, getUserInfo } from "./api";

const PAGE_LIMIT = 3;

function HomePage() {
  const [page, setPage] = useState(0);

  // API 호출 예시: 페이지와 한 페이지 당 개수를 전달
  const { data: postData, isPending, isError } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => getPosts(page, PAGE_LIMIT),
  });

  const posts = postData?.results ?? [];

  // 아래 변수들은 예시용 placeholder입니다.
  const currentUsername = ""; // 실제 사용자 이름을 관리해야 합니다.
  const loginMessage = ""; // 로그인 후 표시할 메시지
  const handleLoginButtonClick = () => {}; // 로그인 버튼 클릭 핸들러
  const [content, setContent] = useState(""); // 게시글 내용
  const handleInputChange = (e) => setContent(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    // 업로드 로직을 구현하세요.
  };

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
          <button disabled={!content} type="submit">
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
        {/* 필요에 따라 다음 페이지 버튼도 추가 */}
      </div>
    </>
  );
}

export default HomePage;
