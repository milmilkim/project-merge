import { useEffect, useState } from 'react';
import { createPost, updatePost, usePost } from '@/features/board';
import type { BoardType } from '@/entities/post';

interface Props {
  board: BoardType;
  /** null이면 신규 작성, 값 있으면 해당 글 수정 */
  postId: string | null;
  onDone: (postId: string | null) => void;
  onCancel: () => void;
}

export const PostForm = ({ board, postId, onDone, onCancel }: Props) => {
  const { post } = usePost(postId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  // 수정 모드: 기존 글 로드되면 폼 채우기
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const valid = title.trim() && content.trim();

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      if (postId) {
        await updatePost(postId, { title, content });
        onDone(postId);
      } else {
        const id = await createPost({ board, title, content });
        onDone(id);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장에 실패했습니다.');
      setBusy(false);
    }
  };

  return (
    <div className='mt-2 space-y-2'>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='제목'
        className='w-full border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[15px] text-ed6-text'
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='내용'
        rows={8}
        className='w-full resize-y border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[15px] leading-[24px] text-ed6-text'
      />
      <div className='flex justify-end gap-2 font-galmuri11 text-[12px]'>
        <button onClick={onCancel} className='border border-[#9a9a9a] bg-ed6-silver px-3 py-1 active:translate-y-px'>
          취소
        </button>
        <button
          onClick={submit}
          disabled={!valid || busy}
          className='border border-ed6-silverBorder bg-ed6-silver px-3 py-1 text-ed6-lunaBlue active:translate-y-px disabled:opacity-50'>
          {busy ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
};
