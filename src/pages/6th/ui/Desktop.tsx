import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlissBackground } from './BlissBackground';
import { XpWindow } from './XpWindow';
import { TitleWindow } from './TitleWindow';
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { Mascot } from './Mascot';
import { WINDOW_CONTENT } from './windows';
import { BoardWindow } from '../board/BoardWindow';
import { RecentPostsWidget } from '../board/ui/RecentPostsWidget';
import { desktopIcons, edition6, type DesktopIconDef } from '../config';
import { useCountdown } from '@/shared/lib';
import { useAuth } from '@/features/auth';
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
 * 데스크탑(메인). 배경/창/아이콘/작업표시줄/마스코트를 조립하고
 * 창 매니저(열림·최소화·닫기·복원)와 아이콘 선택 상태를 관리한다.
 * 일반 창 본문은 windows.tsx 레지스트리에서, 게시판 창은 BoardWindow로 렌더한다.
 */
export const Desktop = () => {
  const navigate = useNavigate();
  const deskRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  // 타이틀 윈도우는 항상 첫 항목으로 열려 있다.
  const [windows, setWindows] = useState<WinState[]>([
    { id: 'title', status: 'open' },
  ]);
  const [selected, setSelected] = useState<string | null>(INITIAL_SELECTED);
  // 최근 글 위젯에서 특정 글로 진입할 때만 세팅. 아이콘 클릭 시엔 목록부터 연다.
  const [pendingPost, setPendingPost] = useState<{
    board: BoardType;
    id: string;
  } | null>(null);
  const days = useCountdown(edition6.openDate);
  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 640px)').matches;

  /** 단일 창 정책: 항상 한 창만 열리고 나머지는 작업표시줄로 최소화된다. */
  const focus = (id: string) =>
    setWindows((prev) => {
      const list = prev.find((w) => w.id === id)
        ? prev
        : [...prev, { id, status: 'minimized' as WinStatus }];
      return list.map((w) => ({
        ...w,
        status: w.id === id ? 'open' : 'minimized',
      }));
    });

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
    setPendingPost({ board: post.board, id: post.id });
    focus(`board:${post.board}`);
  };

  const minimize = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'minimized' } : w))
    );
  // 창을 닫으면 단순히 제거한다. 타이틀 창은 닫기=최소화라 목록엔 남아있다.
  const close = (id: string) =>
    setWindows((prev) => prev.filter((w) => w.id !== id));
  const restore = (id: string) => focus(id);

  const titleOf = (id: string) => {
    if (id === 'title') return '제6회 머지영화제 — 환영합니다';
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
          />
        ))}
      </div>

      {/* 최근 글 위젯 — 우상단 상주 */}
      <div
        className='absolute right-3 top-[18px] z-10'
        onClick={(e) => e.stopPropagation()}>
        <RecentPostsWidget onOpen={openBoardPost} />
      </div>

      {/* 창들 — 삐삐(z-30)보다 위 */}
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
            const Content =
              isTitle || board ? null : WINDOW_CONTENT[w.id]?.Content;
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
                ) : board ? (
                  <BoardWindow
                    board={board}
                    auth={auth}
                    initialPostId={initialPostId}
                  />
                ) : Content ? (
                  <Content />
                ) : null}
              </XpWindow>
            );
          })}
      </div>

      <Mascot />
      <Taskbar
        days={days}
        minimized={minimized}
        onRestore={restore}
        onOpen={focus}
      />
    </div>
  );
};
