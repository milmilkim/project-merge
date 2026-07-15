import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';
import type { BoardType } from '@/entities/post';

/** 새 글 작성. 생성된 문서의 id를 반환. 로그인 필수(rules에서도 강제). */
export async function createPost(input: {
  board: BoardType;
  title: string;
  content: string;
}): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  const ref = await addDoc(collection(db, 'posts'), {
    board: input.board,
    title: input.title.trim(),
    content: input.content.trim(),
    authorUid: u.uid,
    authorName: u.displayName ?? '익명',
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
  return ref.id;
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
