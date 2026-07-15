import { usePosts } from '@/features/board';
import type { BoardType } from '@/entities/post';

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
      <div className='mb-2 flex justify-end'>
        <button
          onClick={onCreate}
          disabled={!canWrite}
          className='border border-ed6-silverBorder bg-ed6-silver px-3 py-1 font-galmuri11 text-[11px] text-ed6-lunaBlue active:translate-y-px disabled:opacity-50'>
          글쓰기
        </button>
      </div>

      {error && (
        <p className='font-galmuri11 text-[11px] text-red-600'>
          목록을 불러오지 못했어요: {error}
        </p>
      )}
      {loading && <p className='font-galmuri11 text-[11px] text-[#666]'>불러오는 중…</p>}
      {!loading && posts.length === 0 && (
        <p className='py-6 text-center font-galmuri11 text-[11px] text-[#666]'>
          아직 글이 없어요.
        </p>
      )}

      <ul className='divide-y divide-[#c4c0b2] border-y border-[#c4c0b2] bg-white'>
        {posts.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onOpen(p.id)}
              className='flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-[#eef3ff]'>
              <span className='truncate font-galmuri14 text-[14px] text-ed6-text'>
                {p.title}
              </span>
              <span className='shrink-0 font-galmuri9 text-[9px] text-[#888]'>
                {p.authorName} · {fmt(p.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
