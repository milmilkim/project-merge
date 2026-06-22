import { Outlet, useLocation } from 'react-router-dom';
import { EditionSwitcher } from '@/widgets';

/** 레거시 회차별 EditionSwitcher 텍스트 색(text-current 기준 색) */
const SWITCHER_COLOR: Record<string, string> = {
  '4th': 'text-ed4-text', // 다크 테마 → 흰색
  '5th': 'text-ed5-text', // 라이트 테마 → 짙은 보라
};

/**
 * 레거시 회차(4·5회) 공통 레이아웃.
 * 알약형 EditionSwitcher를 회차 셸 바깥(라우터)에서 한 번만 마운트한다.
 * EditionSwitcher는 text-current를 쓰므로 회차 테마 색을 여기서 입혀준다.
 * 6회는 XP 작업표시줄에 자체 회차 스왑 UI가 있어 이 레이아웃을 쓰지 않는다.
 */
export const LegacyEditionLayout = () => {
  const slug = useLocation().pathname.split('/').filter(Boolean)[0];
  const color = SWITCHER_COLOR[slug] ?? 'text-white';

  return (
    <>
      <div className={color}>
        <EditionSwitcher />
      </div>
      <Outlet />
    </>
  );
};
