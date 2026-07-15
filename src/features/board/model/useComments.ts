import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';
import type { Comment } from '@/entities/post';

/** 특정 글의 댓글 목록(오래된 순, 실시간). postId가 null이면 빈 배열. */
export function useComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc'),
    );
    return onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            content: data.content ?? '',
            authorUid: data.authorUid ?? '',
            authorName: data.authorName ?? '익명',
            createdAt: data.createdAt?.toMillis?.() ?? null,
          };
        }),
      );
    });
  }, [postId]);

  return comments;
}

export function addComment(postId: string, content: string) {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  return addDoc(collection(db, 'posts', postId, 'comments'), {
    content: content.trim(),
    authorUid: u.uid,
    authorName: u.displayName ?? '익명',
    createdAt: serverTimestamp(),
  });
}

export function deleteComment(postId: string, commentId: string) {
  return deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
}
