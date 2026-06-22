import type { Edition, EditionSlug } from '@/entities/edition';

/**
 * 머지영화제 회차 목록. 새 회차 추가 시 이 배열에 한 줄 추가하고
 * 해당 회차의 pages/{slug}, widgets/{slug} 를 만들면 된다.
 */
export const editions: Edition[] = [
  {
    no: 4,
    slug: '4th',
    title: '제4회 머지영화제',
    subtitle: 'REBIRTH N REVERSE',
    venue: {
      name: 'JK 블라썸 호텔',
      address: '서울특별시 강서구 양천로 65길 41-22',
    },
    status: 'published',
  },
  {
    no: 5,
    slug: '5th',
    title: '제5회 머지영화제',
    subtitle: '이상한 영화 몰아보기',
    venue: {
      name: '인터시티서울호텔',
      address: '서울특별시 강서구 마곡동 797-11',
    },
    status: 'published',
  },
  {
    no: 6,
    slug: '6th',
    title: '제6회 머지영화제',
    status: 'coming-soon',
  },
];

/** 루트(/)가 가리키는 최신 회차. 새 회차 오픈 시 수동 업데이트. */
export const LATEST: EditionSlug = '6th';

export const getEdition = (slug: EditionSlug): Edition | undefined =>
  editions.find((e) => e.slug === slug);
