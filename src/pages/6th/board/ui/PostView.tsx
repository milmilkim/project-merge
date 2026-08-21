import { useState } from 'react';
import type { AuthState } from '@/features/auth';
import { RichText } from '@/shared/ui/RichText';
import {
  addComment,
  deleteComment,
  deletePost,
  useComments,
  usePost,
} from '@/features/board';

interface Props {
  postId: string;
  auth: AuthState;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString('ko-KR') : '…';

export const PostView = ({ postId, auth, onBack, onEdit }: Props) => {
  const { post, loading } = usePost(postId);
  const comments = useComments(postId);
  const [text, setText] = useState('');

  if (loading) return <p className='mt-3 font-galmuri11 text-[12px] text-[#666]'>불러오는 중…</p>;
  if (!post) {
    return (
      <div className='mt-3'>
        <p className='font-galmuri11 text-[12px] text-[#666]'>삭제되었거나 없는 글입니다.</p>
        <button onClick={onBack} className={ghostBtn}>목록으로</button>
      </div>
    );
  }

  const uid = auth.user?.uid;
  const canEdit = !!uid && (uid === post.authorUid || auth.isAdmin);

  const remove = async () => {
    if (!confirm('이 글을 삭제하시겠습니까?')) return;
    try {
      await deletePost(post.id);
      onBack();
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했습니다.');
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteComment(post.id, commentId);
    } catch (e) {
      alert(e instanceof Error ? e.message : '댓글 삭제 실패');
    }
  };

  const submitComment = async () => {
    if (!text.trim()) return;
    try {
      await addComment(post.id, text);
      setText('');
    } catch (e) {
      alert(e instanceof Error ? e.message : '댓글 저장 실패');
    }
  };

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between'>
        <button onClick={onBack} className={ghostBtn}>← 목록</button>
        {canEdit && (
          <div className='flex gap-2 font-galmuri11 text-[12px]'>
            <button onClick={() => onEdit(post.id)} className={ghostBtn}>수정</button>
            <button onClick={remove} className={ghostBtn}>삭제</button>
          </div>
        )}
      </div>

      <article className='mt-2 border border-[#c4c0b2] bg-white p-3'>
        <h2 className='font-galmuri14 text-[15px] font-bold text-ed6-text'>{post.title}</h2>
        <p className='mt-1 font-galmuri9 text-[10px] text-[#888]'>
          {post.authorName} · {fmt(post.createdAt)}
          {post.updatedAt && ' · (수정됨)'}
        </p>
        <RichText
          text={post.content}
          headingClassName='font-bold text-ed6-lunaBlue'
          className='mt-3 font-galmuri14 text-[15px] leading-[26px] text-ed6-text'
        />
      </article>

      {/* 댓글 */}
      <section className='mt-3'>
        <h3 className='font-galmuri11 text-[12px] text-ed6-lunaBlue'>댓글 {comments.length}</h3>
        <ul className='mt-1 space-y-1'>
          {comments.map((c) => {
            const mine = !!uid && (uid === c.authorUid || auth.isAdmin);
            return (
              <li key={c.id} className='flex items-start justify-between gap-2 border-b border-[#e4e0d2] py-1'>
                <span className='font-galmuri11 text-[12px] text-ed6-text'>
                  <b className='text-[#555]'>{c.authorName}</b> {c.content}
                </span>
                {mine && (
                  <button
                    onClick={() => removeComment(c.id)}
                    className='shrink-0 font-galmuri9 text-[10px] text-[#999] hover:text-red-600'>
                    삭제
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {auth.user ? (
          <div className='mt-2 flex gap-1'>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder='댓글 달기'
              className='flex-1 border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri11 text-[12px] text-ed6-text'
            />
            <button onClick={submitComment} className='border border-ed6-silverBorder bg-ed6-silver px-3 font-galmuri11 text-[12px] text-ed6-lunaBlue active:translate-y-px'>
              등록
            </button>
          </div>
        ) : (
          <p className='mt-2 font-galmuri9 text-[10px] text-[#888]'>로그인하면 댓글을 쓸 수 있습니다.</p>
        )}
      </section>
    </div>
  );
};

const ghostBtn =
  'border border-[#9a9a9a] bg-ed6-silver px-2 py-[3px] font-galmuri11 text-[12px] text-ed6-lunaBlue active:translate-y-px';
