import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { Post } from '@/entities/post';
import { toPost } from './toPost';

/** 글 1건 실시간 구독. id가 null이면 구독하지 않는다. */
export function usePost(id: string | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onSnapshot(doc(db, 'posts', id), (snap) => {
      setPost(snap.exists() ? toPost(snap) : null);
      setLoading(false);
    });
  }, [id]);

  return { post, loading };
}
