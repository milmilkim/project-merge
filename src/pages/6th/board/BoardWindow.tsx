import { useState } from 'react';
import type { AuthState } from '@/features/auth';
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

interface Props {
  board: BoardType;
  auth: AuthState;
  /** 최근 글 위젯에서 특정 글로 바로 진입할 때. 없으면 목록부터. */
  initialPostId?: string;
}

/**
 * 데스크탑 창 하나 = 게시판 하나. board는 창별로 고정(탭 없음).
 * 목록↔상세↔작성을 내부 상태로 전환하고, 데이터/권한은 features 훅에서 온다.
 * XpWindow 프레임은 Desktop이 씌우므로 여기선 본문만 그린다.
 */
export const BoardWindow = ({ board, auth, initialPostId }: Props) => {
  const [mode, setMode] = useState<Mode>(
    initialPostId ? { view: 'detail', postId: initialPostId } : { view: 'list' },
  );

  // 공지는 관리자만 글쓰기(자유·리뷰는 로그인 유저 누구나)
  const canWrite = !!auth.user && (board !== 'notice' || auth.isAdmin);

  return (
    <div className='max-h-[70vh] w-[min(90vw,520px)] overflow-y-auto p-3 sm:p-4'>
      <AuthBar auth={auth} />

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
  );
};
