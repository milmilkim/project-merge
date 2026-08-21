import { usePosts } from '@/features/board';
import type { BoardType } from '@/entities/post';
import { NewBadge } from './NewBadge';

interface Props {
  board: BoardType;
  canWrite: boolean;
  onOpen: (id: string) => void;
  onCreate: () => void;
}

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString('ko-KR') : '…';

export const BoardList = ({ board, canWrite, onOpen, onCreate }: Props) => {
  const { posts, loading, error } = usePosts(board);

  return (
    <div className='mt-2'>
      {/* 권한 없으면(비로그인, 공지의 일반 유저) 버튼 자체를 숨긴다 */}
      {canWrite && (
        <div className='mb-2 flex justify-end'>
          <button
            onClick={onCreate}
            className='border border-ed6-silverBorder bg-ed6-silver px-3 py-1 font-galmuri11 text-[12px] text-ed6-lunaBlue active:translate-y-px'>
            글쓰기
          </button>
        </div>
      )}

      {error && (
        <p className='font-galmuri11 text-[12px] text-red-600'>
          목록을 불러오지 못했습니다: {error}
        </p>
      )}
      {loading && <p className='font-galmuri11 text-[12px] text-[#666]'>불러오는 중…</p>}
      {!loading && posts.length === 0 && (
        <p className='py-6 text-center font-galmuri11 text-[12px] text-[#666]'>
          아직 글이 없습니다.
        </p>
      )}

      <ul className='divide-y divide-[#c4c0b2] border-y border-[#c4c0b2] bg-white'>
        {posts.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onOpen(p.id)}
              className='flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-[#eef3ff]'>
              <span className='min-w-0 truncate font-galmuri14 text-[15px] text-ed6-text'>
                {p.title}
                <NewBadge createdAt={p.createdAt} />
              </span>
              <span className='shrink-0 font-galmuri9 text-[10px] text-[#888]'>
                {p.authorName} · {fmt(p.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
