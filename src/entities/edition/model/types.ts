export type EditionSlug = '4th' | '5th' | '6th';

/**
 * GNB(회차 스왑) 레지스트리용 최소 정보.
 * 회차의 제목·장소 등 콘텐츠 메타데이터는 각 회차 폴더가 자체적으로 소유한다.
 */
export interface EditionEntry {
  no: number;
  slug: EditionSlug;
  status: 'published' | 'coming-soon';
}
