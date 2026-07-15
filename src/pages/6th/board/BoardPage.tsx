import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlissBackground } from '../ui/BlissBackground';
import { XpWindow } from '../ui/XpWindow';
import { useAuth } from '@/features/auth';
import { BOARDS } from '@/shared/config/board';
import type { BoardType } from '@/entities/post';
import { AuthBar } from './ui/AuthBar';
import { BoardList } from './ui/BoardList';
import { PostForm } from './ui/PostForm';
import { PostView } from './ui/PostView';

type Mode =
  | { view: 'list' }
  | { view: 'detail'; postId: string }
  | { view: 'create' }
  | { view: 'edit'; postId: string };

/**
 * /6th/board — Y2K 창 프레임 안에서 자유·리뷰·공지 게시판.
 * 목록↔상세↔작성은 페이지 내부 상태로 전환(최소 라우팅).
 */
export default function BoardPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [board, setBoard] = useState<BoardType>('free');
  const [mode, setMode] = useState<Mode>({ view: 'list' });

  // 공지는 관리자만 글쓰기 가능(자유·리뷰는 로그인 유저 누구나)
  const canWrite = !!auth.user && (board !== 'notice' || auth.isAdmin);

  return (
    <div className='theme-6th relative flex min-h-[100dvh] w-full items-start justify-center overflow-auto bg-black p-3 sm:p-6'>
      <BlissBackground />
      <XpWindow
        title='게시판 — 머지 BBS'
        draggable={false}
        onClose={() => navigate('/6th')}
        className='relative z-10 w-full max-w-[720px]'>
        <div className='p-3 sm:p-4'>
          <AuthBar auth={auth} />

          <div className='mt-2 flex gap-1'>
            {BOARDS.map((b) => (
              <button
                key={b.type}
                onClick={() => {
                  setBoard(b.type);
                  setMode({ view: 'list' });
                }}
                className={`border border-ed6-silverBorder px-3 py-1 font-galmuri11 text-[11px] active:translate-y-px ${
                  board === b.type
                    ? 'bg-ed6-lunaBlue text-white'
                    : 'bg-ed6-silver text-ed6-lunaBlue'
                }`}>
                {b.label}
              </button>
            ))}
          </div>

          {mode.view === 'list' && (
            <BoardList
              board={board}
              canWrite={canWrite}
              onOpen={(id) => setMode({ view: 'detail', postId: id })}
              onCreate={() => setMode({ view: 'create' })}
            />
          )}
          {mode.view === 'detail' && (
            <PostView
              postId={mode.postId}
              auth={auth}
              onBack={() => setMode({ view: 'list' })}
              onEdit={(id) => setMode({ view: 'edit', postId: id })}
            />
          )}
          {(mode.view === 'create' || mode.view === 'edit') && (
            <PostForm
              board={board}
              postId={mode.view === 'edit' ? mode.postId : null}
              onDone={(id) =>
                setMode(id ? { view: 'detail', postId: id } : { view: 'list' })
              }
              onCancel={() => setMode({ view: 'list' })}
            />
          )}
        </div>
      </XpWindow>
    </div>
  );
}
