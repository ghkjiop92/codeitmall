import React from "react";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://learn.codeit.kr/api/codestudit";

// 에러 상태를 테스트하기 위한 예시 컴포넌트 (필요에 따라 사용)
export function ExampleQuery() {
  const { error, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // 예시로 항상 에러를 발생시킴
      throw new Error("An error occurred!");
    },
  });

  console.log("ExampleQuery error:", error);
  console.log("ExampleQuery isError:", isError);

  return <div>{isError ? `Error: ${error.message}` : "No error"}</div>;
}

// 실제 API 호출 함수: 게시글 전체 가져오기 (페이지와 limit 지원)
export async function getPosts(page = 0, limit = 10) {
  const response = await fetch(`${BASE_URL}/posts?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("An error happened.");
  }
  return await response.json();
}

// 실제 API 호출 함수: username에 따른 게시글 가져오기
export async function getPostsByUsername(username) {
  const response = await fetch(`${BASE_URL}/post?username=${username}`);
  if (!response.ok) {
    throw new Error("Failed to fetch posts by username.");
  }
  return await response.json();
}

// 실제 API 호출 함수: 사용자 정보 가져오기
export async function getUserInfo(username) {
  const response = await fetch(`${BASE_URL}/user/${username}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user info.");
  }
  return await response.json();
}

// 실제 API 호출 함수: 게시글의 좋아요 수 가져오기
export async function getLikeCountByPostId(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes`);
  const body = await response.json();
  return body.count;
}

// 실제 API 호출 함수: 특정 사용자의 게시글 좋아요 상태 가져오기
export async function getLikeStatusByUsername(postId, username) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes/${username}`);
  if (response.status === 200) {
    return true;
  } else if (response.status === 404) {
    return false;
  } else {
    throw new Error("Failed to get like status of the post");
  }
}

// 기본 내보내기 함수: 게시글에 좋아요를 누르는 함수
export default async function likePost(postId, username) {
  const response = await fetch(`${BASE_URL}/posts/${postId}/likes/${username}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to like the post");
  }
  return await response.json();
}
