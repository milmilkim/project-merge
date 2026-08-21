import { useState } from 'react';
import { BootIntro } from './ui/BootIntro';
import { Desktop } from './ui/Desktop';
import { BOOT_FLAG } from './config';

/**
 * 제6회 머지영화제 — Y2K 레트로 컴퓨팅 티저.
 * 흐름: 부팅 인트로(하루 1회) → 데스크탑(메인).
 * 4·5회와 달리 EditionSwitcher 레이아웃을 쓰지 않고, 작업표시줄에 자체 회차 스왑이 있다.
 */
export default function Edition6() {
  // 부팅 인트로는 하루 1회만 — 오늘 이미 봤으면 바로 데스크탑
  const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD(로컬)
  const [booted, setBooted] = useState(
    () => localStorage.getItem(BOOT_FLAG) === today
  );

  const finishBoot = () => {
    localStorage.setItem(BOOT_FLAG, today);
    setBooted(true);
  };

  return (
    <div className='theme-6th relative h-[100dvh] w-full overflow-hidden bg-black'>
      {booted ? <Desktop /> : <BootIntro onDone={finishBoot} />}
    </div>
  );
}
