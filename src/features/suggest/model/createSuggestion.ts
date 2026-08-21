import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';

/** 상영작 추천 신청(일방 폼). 로그인 필수. 조회 UI 없음 — 운영자는 콘솔에서 본다. */
export async function createSuggestion(input: { title: string; reason: string }) {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  await addDoc(collection(db, 'suggestions'), {
    title: input.title.trim(),
    reason: input.reason.trim(),
    authorUid: u.uid,
    authorName: u.displayName ?? '익명',
    authorEmail: u.email ?? null,
    createdAt: serverTimestamp(),
  });
}

/** 추천 삭제(관리자 전용 — rules에서 강제). */
export function deleteSuggestion(id: string) {
  return deleteDoc(doc(db, 'suggestions', id));
}
