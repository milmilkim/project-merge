import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { Post } from '@/entities/post';
import { toPost } from './toPost';

/**
 * 전체 게시판 통합 최신 글 N개(실시간).
 * 정렬만 하는 단일 쿼리(where 없음)라 복합 인덱스가 필요 없다.
 */
export function useRecentPosts(count = 5) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(count),
    );
    return onSnapshot(q, (snap) => setPosts(snap.docs.map(toPost)));
  }, [count]);

  return posts;
}
