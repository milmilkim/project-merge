import { usePosts, useRecentPosts } from '@/features/board';
import { BOARDS } from '@/shared/config/board';
import type { Post } from '@/entities/post';
import { NewBadge } from './NewBadge';

const labelOf = (board: string) =>
  BOARDS.find((b) => b.type === board)?.label.replace('게시판', '') ?? board;

const fmt = (ms: number | null) =>
  ms
    ? new Date(ms).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
    : '';

interface Props {
  /** 항목 클릭 → 해당 게시판 창을 그 글 상세로 연다 */
  onOpen: (post: Post) => void;
}

/**
 * 바탕화면 상주 가젯 — 옛 다음 카페 메인 테이블 톤.
 * 상단 '공지사항'(최신 3) / 하단 '최신글'(공지 제외 5) 두 섹션으로 구분. 비로그인도 읽기 가능.
 */
export const RecentPostsWidget = ({ onOpen }: Props) => {
  const notices = usePosts('notice').posts.slice(0, 3);
  // ponytail: where board!=notice 는 복합 인덱스가 필요해서, 넉넉히 받아 클라에서 거른다
  const recent = useRecentPosts(12)
    .filter((p) => p.board !== 'notice')
    .slice(0, 5);

  return (
    <div
      className='w-full rounded-[3px] border border-[#c9bfec] shadow-[2px_3px_0_rgba(0,0,0,.2)]'
      style={{ background: 'linear-gradient(180deg,#ffffff,#efeaff)' }}>
      <Section title='공지사항' tone='#e8836b' empty='등록된 공지가 없습니다'>
        {notices.map((p) => (
          <Row key={p.id} post={p} onOpen={onOpen} />
        ))}
      </Section>
      <Section title='최신글' tone='#8b7fd9' empty='아직 글이 없습니다'>
        {recent.map((p) => (
          <Row key={p.id} post={p} onOpen={onOpen} showBoard />
        ))}
      </Section>
    </div>
  );
};

const Section = ({
  title,
  tone,
  empty,
  children,
}: {
  title: string;
  tone: string;
  empty: string;
  children: React.ReactNode[];
}) => (
  <>
    <div className='flex items-center gap-[6px] border-y border-[#c9bfec]/60 bg-[#f5f2ff] px-[10px] py-[5px] first:border-t-0'>
      <span className='h-[9px] w-[9px] rounded-[2px]' style={{ background: tone }} />
      <span className='font-galmuri11 text-[12px] font-bold text-[#5a4f8a]'>{title}</span>
    </div>
    <ul className='px-[6px] py-[4px]'>
      {children.length === 0 && (
        <li className='px-1 py-[6px] text-center font-galmuri9 text-[10px] text-[#8b80b8]'>
          {empty}
        </li>
      )}
      {children}
    </ul>
  </>
);

const Row = ({
  post: p,
  onOpen,
  showBoard,
}: {
  post: Post;
  onOpen: (post: Post) => void;
  showBoard?: boolean;
}) => (
  <li>
    <button
      onClick={() => onOpen(p)}
      className='flex w-full items-baseline gap-[5px] rounded-[2px] px-1 py-[4px] text-left hover:bg-[#efeaff]'>
      {showBoard && (
        <span className='shrink-0 font-galmuri9 text-[10px] text-ed6-lunaBlue'>
          [{labelOf(p.board)}]
        </span>
      )}
      <span className='min-w-0 flex-1 truncate font-galmuri11 text-[12px] text-[#4a4466]'>
        {p.title}
        <NewBadge createdAt={p.createdAt} />
      </span>
      <span className='shrink-0 font-galmuri9 text-[10px] text-[#8b80b8]'>
        {fmt(p.createdAt)}
      </span>
    </button>
  </li>
);
