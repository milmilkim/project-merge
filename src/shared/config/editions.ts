import type { EditionEntry, EditionSlug } from '@/entities/edition';

/**
 * 회차 스왑 GNB가 사용하는 레지스트리.
 * 새 회차를 추가하면 여기에 한 줄 추가하고 pages/{slug}, widgets/{slug} 를 만든다.
 * 회차의 제목·부제·장소 등 콘텐츠는 각 회차 폴더가 직접 소유한다(중앙 집중 X).
 */
export const editions: EditionEntry[] = [
  { no: 4, slug: '4th', status: 'published' },
  { no: 5, slug: '5th', status: 'published' },
  { no: 6, slug: '6th', status: 'coming-soon' },
];

/** 루트(/)가 가리키는 최신 회차. 새 회차 오픈 시 수동 업데이트. */
export const LATEST: EditionSlug = '6th';
