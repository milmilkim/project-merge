import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlissBackground } from './BlissBackground';
import { XpWindow } from './XpWindow';
import { TitleWindow } from './TitleWindow';
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { Mascot } from './Mascot';
import { WINDOW_CONTENT } from './windows';
import { desktopIcons, edition6, type DesktopIconDef } from '../config';
import { useCountdown } from '@/shared/lib';

type WinStatus = 'open' | 'minimized';

interface WinState {
  id: string;
  status: WinStatus;
}

/** 초기 선택 아이콘 */
const INITIAL_SELECTED = desktopIcons.find((d) => d.active)?.id ?? null;

/**
 * 데스크탑(메인). 배경/창/아이콘/작업표시줄/마스코트를 조립하고
 * 창 매니저(열림·최소화·닫기·복원)와 아이콘 선택 상태를 관리한다.
 * 창 본문은 windows.tsx의 레지스트리(WINDOW_CONTENT)에서 가져온다(상태 분기 X).
 */
export const Desktop = () => {
  const navigate = useNavigate();
  const deskRef = useRef<HTMLDivElement>(null);
  // 타이틀 윈도우는 항상 첫 항목으로 열려 있다.
  const [windows, setWindows] = useState<WinState[]>([
    { id: 'title', status: 'open' },
  ]);
  const [selected, setSelected] = useState<string | null>(INITIAL_SELECTED);
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
    focus(def.id);
  };

  const minimize = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'minimized' } : w))
    );
  // 창을 닫으면 단순히 제거한다. 마지막 창을 닫아도 다른 창을 자동으로 띄우지
  // 않는다(전부 닫힌 상태가 됨). 타이틀 창은 닫기=최소화라 목록엔 남아있다.
  const close = (id: string) =>
    setWindows((prev) => prev.filter((w) => w.id !== id));
  const restore = (id: string) => focus(id);

  const titleOf = (id: string) =>
    id === 'title'
      ? '제6회 머지영화제 — 환영합니다'
      : WINDOW_CONTENT[id]?.title ?? id;

  const minimized = windows
    .filter((w) => w.status === 'minimized')
    .map((w) => ({ id: w.id, title: titleOf(w.id) }));

  return (
    <div
      ref={deskRef}
      className='relative h-[100dvh] w-full overflow-hidden'
      onClick={() => setSelected(null)}>
      <BlissBackground />

      {/* 바탕화면 아이콘 — 좌상단 세로 1열 */}
      <div
        className='absolute left-2 top-[18px] z-10 flex flex-col gap-[6px]'
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

      {/* 창들 — 삐삐(z-30)보다 위 */}
      <div
        className='pointer-events-none absolute inset-0 z-50 flex flex-wrap items-center justify-center gap-5 p-3'
        onClick={(e) => e.stopPropagation()}>
        {windows
          .filter((w) => w.status === 'open')
          .map((w) => {
            const isTitle = w.id === 'title';
            const Content = isTitle ? null : WINDOW_CONTENT[w.id]?.Content;
            return (
              <XpWindow
                key={w.id}
                title={titleOf(w.id)}
                draggable={!isTouch}
                dragConstraints={deskRef}
                onMinimize={() => minimize(w.id)}
                onClose={isTitle ? () => minimize(w.id) : () => close(w.id)}>
                {isTitle ? <TitleWindow /> : Content ? <Content /> : null}
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
