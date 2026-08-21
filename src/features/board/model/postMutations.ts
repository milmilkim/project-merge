import {
  deleteDoc,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';
import type { BoardType } from '@/entities/post';

/**
 * 새 글 작성. 생성된 문서의 id(= 글 번호 "1", "2", …)를 반환. 로그인 필수(rules에서도 강제).
 * Firestore엔 자동증가가 없어 counters/posts.seq 를 트랜잭션으로 +1 해서 번호를 딴다.
 * ponytail: 글로벌 카운터 하나(게시판 공통 번호). 트래픽 적어 경합 걱정 없음
 */
export async function createPost(input: {
  board: BoardType;
  title: string;
  content: string;
}): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  const counterRef = doc(db, 'counters', 'posts');
  return runTransaction(db, async (tx) => {
    const seq = ((await tx.get(counterRef)).data()?.seq ?? 0) + 1;
    const id = String(seq);
    tx.set(counterRef, { seq });
    tx.set(doc(db, 'posts', id), {
      board: input.board,
      title: input.title.trim(),
      content: input.content.trim(),
      authorUid: u.uid,
      authorName: u.displayName ?? '익명',
      createdAt: serverTimestamp(),
      updatedAt: null,
    });
    return id;
  });
}

export function updatePost(id: string, patch: { title: string; content: string }) {
  return updateDoc(doc(db, 'posts', id), {
    title: patch.title.trim(),
    content: patch.content.trim(),
    updatedAt: serverTimestamp(),
  });
}

export function deletePost(id: string) {
  return deleteDoc(doc(db, 'posts', id));
}
