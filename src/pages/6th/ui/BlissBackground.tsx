/**
 * 파스텔 그라데이션 배경 — 라벤더 → 하늘 → 피치.
 */
export const BlissBackground = () => {
  return (
    <div
      className='absolute inset-0 z-0'
      style={{
        background:
          'linear-gradient(160deg,#c7c5f4 0%,#a8d8f0 45%,#f9d9e8 100%)',
      }}
    />
  );
};
