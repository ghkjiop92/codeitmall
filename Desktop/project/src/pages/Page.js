import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLikeCountByPostId,
  getLikeStatusByUsername,
  likePost,
  unlikePost,
} from "./api";

function Post({ post, currentUsername }) {
  const queryClient = useQueryClient();

  // 게시글의 좋아요 수 가져오기
  const { data: likeCount } = useQuery({
    queryKey: ["likeCount", post.id],
    queryFn: () => getLikeCountByPostId(post.id),
  });

  // 해당 사용자의 좋아요 상태 가져오기
  const { data: isPostLikedByCurrentUser } = useQuery({
    queryKey: ["likeStatus", post.id, currentUsername],
    queryFn: () => getLikeStatusByUsername(post.id, currentUsername),
    enabled: !!currentUsername, // currentUsername이 있을 때만 실행
  });

  // 좋아요/좋아요 취소를 위한 뮤테이션
  const likesMutation = useMutation({
    mutationFn: async ({ postId, username, userAction }) => {
      if (userAction === "LIKE_POST") {
        return await likePost(postId, username);
      } else {
        return await unlikePost(postId, username);
      }
    },
    onMutate: async ({ postId, username, userAction }) => {
      // 해당 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["likeStatus", postId, username] });
      await queryClient.cancelQueries({ queryKey: ["likeCount", postId] });

      // 기존 상태 스냅샷
      const previousLikeStatus = queryClient.getQueryData(["likeStatus", postId, username]);
      const previousLikeCount = queryClient.getQueryData(["likeCount", postId]);

      // 옵티미스틱 업데이트
      queryClient.setQueryData(["likeStatus", postId, username], () => userAction === "LIKE_POST");
      queryClient.setQueryData(["likeCount", postId], (old) =>
        userAction === "LIKE_POST" ? (old || 0) + 1 : (old || 0) - 1
      );

      // 롤백을 위한 컨텍스트 반환
      return { previousLikeStatus, previousLikeCount };
    },
    onError: (err, variables, context) => {
      const { postId, username } = variables;
      queryClient.setQueryData(["likeStatus", postId, username], context.previousLikeStatus);
      queryClient.setQueryData(["likeCount", postId], context.previousLikeCount);
    },
    onSettled: (data, err, variables) => {
      const { postId, username } = variables;
      queryClient.invalidateQueries({ queryKey: ["likeStatus", postId, username] });
      queryClient.invalidateQueries({ queryKey: ["likeCount", postId] });
    },
  });

  // 좋아요 버튼 클릭 핸들러
  const handleLikeButtonClick = (userAction) => {
    console.log("@@@ here", currentUsername);
    if (!currentUsername) return;
    likesMutation.mutate({
      postId: post.id,
      username: currentUsername,
      userAction,
    });
  };

  return (
    <li>
      <div>
        {post.user.name}: {post.content}
      </div>
      <button
        onClick={() =>
          handleLikeButtonClick(isPostLikedByCurrentUser ? "UNLIKE_POST" : "LIKE_POST")
        }
      >
        {isPostLikedByCurrentUser ? "좋아요 취소" : "좋아요"} ({likeCount ?? 0})
      </button>
    </li>
  );
}

export default Post;
