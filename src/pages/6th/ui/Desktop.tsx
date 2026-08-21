import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlissBackground } from './BlissBackground';
import { XpWindow } from './XpWindow';
import { TitleWindow } from './TitleWindow';
import { ProfileWindow } from './ProfileWindow';
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { WINDOW_CONTENT } from './windows';
import { BoardWindow } from '../board/BoardWindow';
import { RecentPostsWidget } from '../board/ui/RecentPostsWidget';
import { desktopIcons, edition6, type DesktopIconDef } from '../config';
import { useCountdown } from '@/shared/lib';
import { useAuth } from '@/features/auth';
import { useNewBoards } from '@/features/board';
import { BOARDS } from '@/shared/config/board';
import type { BoardType, Post } from '@/entities/post';

type WinStatus = 'open' | 'minimized';

interface WinState {
  id: string;
  status: WinStatus;
}

/** 초기 선택 아이콘 */
const INITIAL_SELECTED = desktopIcons.find((d) => d.active)?.id ?? null;

const isBoardId = (id: string) => id.startsWith('board:');
/** 'board:free' → 'free' */
const boardOf = (id: string) => id.slice('board:'.length) as BoardType;

/**
 * URL ↔ 창 매핑. /6th = 타이틀, /6th/board/:board/:postId? = 게시판, /6th/:id = 일반 창(about·films·profile…).
 * splat('board/free/12' | 'about' | '') → 열 창 id + 글 id
 */
const parseWindowPath = (splat: string): { id: string; postId?: string } | null => {
  const [head, type, postId] = splat.split('/');
  if (head === 'board') {
    const board = BOARDS.find((b) => b.type === type)?.type;
    return board ? { id: `board:${board}`, postId } : null;
  }
  return head && (head in WINDOW_CONTENT || head === 'profile') ? { id: head } : null;
};
const pathOf = (id: string | null, postId?: string) => {
  if (!id || id === 'title') return '/6th';
  if (isBoardId(id)) return `/6th/board/${boardOf(id)}${postId ? `/${postId}` : ''}`;
  return `/6th/${id}`;
};

/**
 * 데스크탑(메인). 배경/창/아이콘/작업표시줄/마스코트를 조립하고
 * 창 매니저(열림·최소화·닫기·복원)와 아이콘 선택 상태를 관리한다.
 * 일반 창 본문은 windows.tsx 레지스트리에서, 게시판 창은 BoardWindow로 렌더한다.
 */
export const Desktop = () => {
  const navigate = useNavigate();
  const { '*': splat = '' } = useParams();
  const deskRef = useRef<HTMLDivElement>(null);
  const rawAuth = useAuth();
  // 신규 가입이면 닉네임부터 받도록 계정 창을 연다
  const [isNewUser, setIsNewUser] = useState(false);
  const auth = {
    ...rawAuth,
    signIn: async () => {
      const isNew = await rawAuth.signIn();
      if (isNew) {
        setIsNewUser(true);
        focus('profile');
      }
      return isNew;
    },
  };
  const newBoards = useNewBoards();
  // URL로 특정 창/글에 직접 진입한 경우 그 창을 열고 시작한다.
  const [fromUrl] = useState(() => parseWindowPath(splat));
  // 타이틀 윈도우는 항상 첫 항목으로 열려 있다.
  const [windows, setWindows] = useState<WinState[]>(() =>
    fromUrl
      ? [
          { id: 'title', status: 'minimized' },
          { id: fromUrl.id, status: 'open' },
        ]
      : [{ id: 'title', status: 'open' }]
  );
  const [selected, setSelected] = useState<string | null>(INITIAL_SELECTED);
  // 최근 글 위젯/URL에서 특정 글로 진입할 때만 세팅. 아이콘 클릭 시엔 목록부터 연다.
  const [pendingPost, setPendingPost] = useState<{
    board: BoardType;
    id: string;
  } | null>(
    fromUrl?.postId ? { board: boardOf(fromUrl.id), id: fromUrl.postId } : null
  );

  /** 열린 창 → URL 동기화(링크 공유용). 히스토리는 쌓지 않는다. */
  const syncUrl = (id: string | null, postId?: string) =>
    navigate(pathOf(id, postId), { replace: true });
  const days = useCountdown(edition6.openDate);
  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 640px)').matches;
  // 모바일은 위젯이 아이콘을 가리므로 접힌 채 시작
  const [widgetOpen, setWidgetOpen] = useState(!isTouch);

  /** 단일 창 정책: 항상 한 창만 열리고 나머지는 작업표시줄로 최소화된다. */
  const focus = (id: string) => {
    // 게시판은 BoardWindow가 목록/상세에 맞춰 스스로 URL을 맞춘다
    if (!isBoardId(id)) syncUrl(id);
    setWindows((prev) => {
      const list = prev.find((w) => w.id === id)
        ? prev
        : [...prev, { id, status: 'minimized' as WinStatus }];
      return list.map((w) => ({
        ...w,
        status: w.id === id ? 'open' : 'minimized',
      }));
    });
  };

  const openIcon = (def: DesktopIconDef) => {
    if (def.action === 'link' && def.href) {
      navigate(def.href);
      return;
    }
    // 게시판 아이콘은 항상 목록부터(직전 위젯 진입 상태 초기화)
    if (def.action === 'board') setPendingPost(null);
    focus(def.id);
  };

  /** 최근 글 위젯 → 해당 게시판 창을 그 글 상세로 연다 */
  const openBoardPost = (post: Post) => {
    if (isTouch) setWidgetOpen(false);
    setPendingPost({ board: post.board, id: post.id });
    focus(`board:${post.board}`);
  };

  const minimize = (id: string) => {
    syncUrl(null);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'minimized' } : w))
    );
  };
  // 창을 닫으면 단순히 제거한다. 타이틀 창은 닫기=최소화라 목록엔 남아있다.
  const close = (id: string) => {
    syncUrl(null);
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };
  const restore = (id: string) => focus(id);

  const titleOf = (id: string) => {
    if (id === 'title') return '제6회 머지영화제';
    if (id === 'profile') return '사용자 계정';
    if (isBoardId(id))
      return BOARDS.find((b) => b.type === boardOf(id))?.label ?? id;
    return WINDOW_CONTENT[id]?.title ?? id;
  };

  const minimized = windows
    .filter((w) => w.status === 'minimized')
    .map((w) => ({ id: w.id, title: titleOf(w.id) }));

  return (
    <div
      ref={deskRef}
      className='relative h-[100dvh] w-full overflow-hidden'
      onClick={() => setSelected(null)}>
      <BlissBackground />

      {/* 바탕화면 아이콘 — 좌상단부터 세로로 쌓되, 높이가 차면 다음 열로 자동 정렬(XP식) */}
      <div
        className='absolute left-2 top-[18px] bottom-[52px] z-10 flex flex-col flex-wrap content-start gap-x-1 gap-y-[6px]'
        onClick={(e) => e.stopPropagation()}>
        {desktopIcons.map((def) => (
          <DesktopIcon
            key={def.id}
            def={def}
            selected={selected === def.id}
            onSelect={setSelected}
            onOpen={openIcon}
            badge={isBoardId(def.id) && newBoards.has(boardOf(def.id))}
          />
        ))}
      </div>

      {/* 최근 글 위젯 — 우상단. 모바일은 아이콘을 가리므로 기본 접힘, 탭으로 토글 */}
      <div
        className='absolute right-2 top-[18px] z-20 flex flex-col items-end gap-1 sm:right-3'
        onClick={(e) => e.stopPropagation()}>
        {isTouch && (
          <button
            onClick={() => setWidgetOpen((o) => !o)}
            className='flex items-center gap-[5px] rounded-[3px] border border-[#c9bfec] bg-white/90 px-2 py-[4px] font-galmuri11 text-[12px] text-[#5a4f8a] shadow-[1px_2px_0_rgba(0,0,0,.2)]'>
            <span className='h-[9px] w-[9px] rounded-[2px] bg-[#8b7fd9]' />
            공지·최신글
            {!widgetOpen && newBoards.size > 0 && (
              <span className='font-galmuri9 text-[9px] font-bold text-[#ff3b30]'>N</span>
            )}
            <span className='text-[10px]'>{widgetOpen ? '▲' : '▼'}</span>
          </button>
        )}
        {widgetOpen && (
          <div className='w-[min(250px,calc(100vw-16px))]'>
            <RecentPostsWidget onOpen={openBoardPost} />
          </div>
        )}
      </div>

      {/* 창들 */}
      <div
        className='pointer-events-none absolute inset-0 z-50 flex flex-wrap items-center justify-center gap-5 p-3'
        onClick={(e) => e.stopPropagation()}>
        {windows
          .filter((w) => w.status === 'open')
          .map((w) => {
            const isTitle = w.id === 'title';
            const board = isBoardId(w.id) ? boardOf(w.id) : null;
            const initialPostId =
              board && pendingPost?.board === board ? pendingPost.id : undefined;
            const isProfile = w.id === 'profile';
            const Content =
              isTitle || isProfile || board ? null : WINDOW_CONTENT[w.id]?.Content;
            return (
              <XpWindow
                key={board ? `${w.id}:${initialPostId ?? 'list'}` : w.id}
                title={titleOf(w.id)}
                draggable={!isTouch}
                dragConstraints={deskRef}
                onMinimize={() => minimize(w.id)}
                onClose={isTitle ? () => minimize(w.id) : () => close(w.id)}>
                {isTitle ? (
                  <TitleWindow />
                ) : isProfile ? (
                  <ProfileWindow
                    auth={auth}
                    isNew={isNewUser}
                    onClose={() => {
                      setIsNewUser(false);
                      close('profile');
                    }}
                  />
                ) : board ? (
                  <BoardWindow
                    board={board}
                    auth={auth}
                    initialPostId={initialPostId}
                    onNavigate={(postId) => syncUrl(w.id, postId)}
                  />
                ) : Content ? (
                  <Content auth={auth} />
                ) : null}
              </XpWindow>
            );
          })}
      </div>

      <Taskbar
        days={days}
        minimized={minimized}
        onRestore={restore}
        onOpen={focus}
        auth={auth}
      />
    </div>
  );
};
