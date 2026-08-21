import { isNewPost } from '@/entities/post';

/** 다음 카페식 'N' 새 글 표시. createdAt이 2주 이내일 때만 렌더. */
export const NewBadge = ({ createdAt }: { createdAt: number | null }) =>
  isNewPost(createdAt) ? (
    <span
      aria-label='새 글'
      className='ml-1 inline-block shrink-0 align-baseline font-galmuri9 text-[9px] font-bold leading-none text-[#ff3b30]'>
      N
    </span>
  ) : null;
