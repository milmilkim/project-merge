import { useRecentPosts } from '@/features/board';
import { BOARDS } from '@/shared/config/board';
import type { Post } from '@/entities/post';

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
 * 바탕화면 상주 '최근 글' 가젯(포스트잇 톤). 전체 게시판 통합 최신 5개를 실시간 표시.
 * 비로그인도 읽기 가능하므로 로그인과 무관하게 항상 뜬다.
 */
export const RecentPostsWidget = ({ onOpen }: Props) => {
  const posts = useRecentPosts(5);

  return (
    <div
      className='w-[196px] rounded-[3px] border border-[#c9b24a] shadow-[2px_3px_0_rgba(0,0,0,.2)]'
      style={{ background: 'linear-gradient(180deg,#fffef2,#fdf4c4)' }}>
      <div className='flex items-center gap-[6px] border-b border-[#c9b24a]/60 px-[10px] py-[6px]'>
        <span className='h-[9px] w-[9px] rounded-[2px] bg-[#e0b93a]' />
        <span className='font-galmuri11 text-[11px] font-bold text-[#5a4a12]'>
          최근 글
        </span>
      </div>

      <ul className='px-[6px] py-[5px]'>
        {posts.length === 0 && (
          <li className='px-1 py-2 text-center font-galmuri9 text-[9px] text-[#8a7a3a]'>
            아직 글이 없어요
          </li>
        )}
        {posts.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onOpen(p)}
              className='flex w-full items-baseline gap-[5px] rounded-[2px] px-1 py-[4px] text-left hover:bg-[#f2e79a]'>
              <span className='shrink-0 font-galmuri9 text-[9px] text-ed6-lunaBlue'>
                [{labelOf(p.board)}]
              </span>
              <span className='min-w-0 flex-1 truncate font-galmuri11 text-[11px] text-[#3a3210]'>
                {p.title}
              </span>
              <span className='shrink-0 font-galmuri9 text-[9px] text-[#a08a3a]'>
                {fmt(p.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
