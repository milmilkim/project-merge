import type { BoardType } from '@/entities/post';

/** 게시판 종류 단일 출처. 탭 렌더 순서도 이 배열을 따른다. */
export const BOARDS: ReadonlyArray<{ type: BoardType; label: string }> = [
  { type: 'free', label: '자유게시판' },
  { type: 'review', label: '리뷰게시판' },
  { type: 'notice', label: '공지게시판' },
];
