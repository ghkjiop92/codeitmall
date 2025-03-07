import { dehydrate, HydrationBoundary, QueryClient, useQuery } from '@tanstack/react-query';
import { getPosts, getComments } from './api';

// SSG (Static Site Generation) - 정적인 데이터 미리 가져오기
export async function getStaticProps() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['posts'],
        queryFn: getPosts,
    });

    await queryClient.prefetchQuery({
        queryKey: ['posts-comments'],
        queryFn: getComments,
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

function Posts() {
    const { data: postsData } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts,
    });

    const { data: commentData } = useQuery({
        queryKey: ['posts-comments'],
        queryFn: getComments,
    });

    if (!postsData) return <p>Loading...</p>;

    return (
        <ul>
            {postsData.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </ul>
    );
}

// Hydration 처리하여 정적인 데이터를 미리 로드 후 클라이언트에 전달
export default function PostsRoute({ dehydratedState }) {
    return (
        <HydrationBoundary state={dehydratedState}>
            <Posts />
        </HydrationBoundary>
    );
}

// Post 컴포넌트
function Post({ post }) {
    return (
        <li key={post.id}>
            {post.user.name}: {post.content}
        </li>
    );
}
