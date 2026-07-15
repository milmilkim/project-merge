import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { BoardType, Post } from '@/entities/post';
import { toPost } from './toPost';

/** 게시판별 글 목록. onSnapshot 실시간 구독 → 작성/삭제 후 수동 refetch 불필요. */
export function usePosts(board: BoardType) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(
      collection(db, 'posts'),
      where('board', '==', board),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map(toPost));
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
  }, [board]);

  return { posts, loading, error };
}
