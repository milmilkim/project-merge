import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { NEW_POST_MS, type BoardType } from '@/entities/post';

/** 최근 2주 내 새 글이 있는 게시판 집합(아이콘 N 표시용). 단일 필드 where라 인덱스 불필요. */
export function useNewBoards() {
  const [boards, setBoards] = useState<Set<BoardType>>(new Set());

  useEffect(() => {
    // ponytail: 마운트 시점 기준 2주. 창 오래 켜두면 경계가 안 움직이지만 위젯 글 갱신엔 지장 없음
    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', new Date(Date.now() - NEW_POST_MS)),
    );
    return onSnapshot(q, (snap) =>
      setBoards(new Set(snap.docs.map((d) => d.data().board as BoardType))),
    );
  }, []);

  return boards;
}
