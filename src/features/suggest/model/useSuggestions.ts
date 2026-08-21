import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export interface Suggestion {
  id: string;
  title: string;
  reason: string;
  authorName: string;
  authorEmail: string | null;
  createdAt: number | null;
}

/** 추천 목록(관리자 전용 — rules가 비관리자 읽기를 거부하므로 enabled로 구독 자체를 막는다). */
export function useSuggestions(enabled: boolean) {
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) =>
      setItems(
        snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            title: x.title ?? '',
            reason: x.reason ?? '',
            authorName: x.authorName ?? '익명',
            authorEmail: x.authorEmail ?? null,
            createdAt: x.createdAt?.toMillis?.() ?? null,
          };
        }),
      ),
    );
  }, [enabled]);

  return items;
}
