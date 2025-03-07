import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, uploadPost, getUserInfo } from "../api";

function HomePage() {
  const queryClient = useQueryClient();

  // 사용자 로그인 상태 관리 (현재 username)
  const [currentUsername, setCurrentUsername] = useState("");

  // 사용자 정보 쿼리: username이 있을 때만 실행
  const {
    data: userInfoData,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", currentUsername],
    queryFn: () => getUserInfo(currentUsername),
    enabled: !!currentUsername,
  });

  // 게시글 데이터 쿼리
  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorObj,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  // 업로드할 게시글 내용을 관리하는 state
  const [content, setContent] = useState("");

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  // 게시글 업로드 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { username: currentUsername, content };
    // 예: 업로드 뮤테이션 호출 (uploadPostMutation) 사용
    // 여기서는 uploadPost API 함수를 사용한 예시를 단순히 콘솔 출력으로 처리합니다.
    console.log("새 게시글 업로드:", newPost);
    // 실제로 업로드하려면 아래와 같이 사용:
    // uploadPostMutation.mutate(newPost);
    setContent("");
  };

  // 로그인 버튼 클릭 핸들러
  const handleLoginButtonClick = () => {
    setCurrentUsername("codeit");
  };

  // 로그인 메시지 (사용자 정보가 있을 경우)
  const loginMessage = userInfoData
    ? `${userInfoData.name}님 환영합니다!`
    : "";

  // 로딩 및 에러 처리
  if (isUserInfoLoading) return <div>로그인 중입니다....</div>;
  if (isUserInfoError) return <div>에러 발생: {userError.message}</div>;
  if (postsLoading) return <div>게시글 로딩 중입니다....</div>;
  if (postsError) return <div>게시글 에러 발생: {postsErrorObj.message}</div>;

  // API 응답 데이터에서 게시글 목록을 추출 (예: { results: [...] } 형식)
  const posts = postsData?.results ?? [];

  return (
    <>
      <div>
        {currentUsername ? (
          <div>{loginMessage}</div>
        ) : (
          <button onClick={handleLoginButtonClick}>
            codeit으로 로그인
          </button>
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
      <div>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.user?.name}: {post.content}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default HomePage;
