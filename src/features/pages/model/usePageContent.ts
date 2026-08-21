import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

/** pages/{id}.content 실시간 구독. 문서 없으면 fallback(코드 기본 텍스트). */
export function usePageContent(id: string, fallback: string) {
  const [content, setContent] = useState(fallback);
  useEffect(
    () =>
      onSnapshot(doc(db, 'pages', id), (snap) => {
        const c = snap.data()?.content;
        setContent(typeof c === 'string' ? c : fallback);
      }),
    [id, fallback],
  );
  return content;
}

/** 안내 페이지 본문 저장(관리자 전용 — rules에서 강제). */
export function savePageContent(id: string, content: string) {
  return setDoc(doc(db, 'pages', id), { content, updatedAt: serverTimestamp() });
}
