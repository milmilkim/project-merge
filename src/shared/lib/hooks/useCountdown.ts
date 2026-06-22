import { useEffect, useState } from 'react';

/**
 * 목표 일시까지 남은 일수를 계산한다.
 * target이 null/미정이면 null을 반환한다(=D-??? 표기용).
 */
export function useCountdown(target: string | null): number | null {
  const [days, setDays] = useState<number | null>(() => calcDays(target));

  useEffect(() => {
    setDays(calcDays(target));
    if (!target) return;
    // 자정 단위로만 갱신하면 충분하므로 1분마다 재계산
    const id = setInterval(() => setDays(calcDays(target)), 60_000);
    return () => clearInterval(id);
  }, [target]);

  return days;
}

function calcDays(target: string | null): number | null {
  if (!target) return null;
  const end = new Date(target).getTime();
  if (Number.isNaN(end)) return null;
  const diff = end - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}
