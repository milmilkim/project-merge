export type BoardType = 'free' | 'review' | 'notice';

export interface Post {
  id: string;
  board: BoardType;
  title: string;
  content: string;
  authorUid: string;
  authorName: string;
  /** epoch millis. serverTimestamp 반영 전(pending) 스냅샷에서는 null. */
  createdAt: number | null;
  updatedAt: number | null;
}

export interface Comment {
  id: string;
  content: string;
  authorUid: string;
  authorName: string;
  createdAt: number | null;
}
