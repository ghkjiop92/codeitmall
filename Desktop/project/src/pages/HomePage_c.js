import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "../api";

const PAGE_LIMIT = 3; // 변수 이름 수정

function HomePage() {
  const [page, setPage] = useState(0);

  // React Query의 useQuery에서 isPending 대신 isLoading을 사용합니다.
  const { data: postData, isLoading, isError } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => getPosts(page, PAGE_LIMIT),
  });

  const posts = postData?.results ?? [];

  // 아래 변수들은 예시용으로, 실제 구현 시 정의되어야 합니다.
  // 예: const [currentUsername, setCurrentUsername] = useState('');
  //     const loginMessage = ...;
  //     const handleLoginButtonClick = () => { ... };
  //     const [content, setContent] = useState('');
  //     const handleInputChange = (e) => setContent(e.target.value);
  //     const handleSubmit = (e) => { ... };

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
    </>
  );
}

export default HomePage;
