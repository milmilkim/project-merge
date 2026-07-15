import type { DocumentSnapshot } from 'firebase/firestore';
import type { Post } from '@/entities/post';

/** Firestore 문서 스냅샷을 앱 도메인 Post로 변환. Timestamp는 millis로. */
export function toPost(d: DocumentSnapshot): Post {
  const data = d.data() ?? {};
  return {
    id: d.id,
    board: data.board,
    title: data.title ?? '',
    content: data.content ?? '',
    authorUid: data.authorUid ?? '',
    authorName: data.authorName ?? '익명',
    createdAt: data.createdAt?.toMillis?.() ?? null,
    updatedAt: data.updatedAt?.toMillis?.() ?? null,
  };
}
