import { useState } from 'react';

/** 더미 포스터 — 라인업 확정 전까지 파스텔 그라데이션 카드 */
const DUMMY_FILMS = [
  { id: 1, bg: 'linear-gradient(160deg,#c7c5f4,#8b7fd9)' },
  { id: 2, bg: 'linear-gradient(160deg,#a8d8f0,#7ba6d9)' },
  { id: 3, bg: 'linear-gradient(160deg,#f9d9e8,#d98bb4)' },
  { id: 4, bg: 'linear-gradient(160deg,#d5f0c8,#8fc07a)' },
  { id: 5, bg: 'linear-gradient(160deg,#fbe9c8,#d9b47b)' },
  { id: 6, bg: 'linear-gradient(160deg,#d8c8f0,#a67bd9)' },
  { id: 7, bg: 'linear-gradient(160deg,#c8ecf0,#7bc0d9)' },
];

const COVER_W = 128;
const COVER_H = 192;

/**
 * 아이팟 커버플로우 스타일 상영작 브라우저.
 * 가운데 포스터는 정면, 양옆은 rotateY로 눕혀서 3D 선반 느낌.
 * 옆 포스터 클릭 / 하단 화살표로 이동.
 */
export const CoverFlow = () => {
  const [active, setActive] = useState(Math.floor(DUMMY_FILMS.length / 2));

  return (
    <div className='w-[min(90vw,540px)] select-none px-2 pb-3 pt-4'>
      {/* 무대 */}
      <div
        className='relative mx-auto h-[230px] overflow-hidden'
        style={{ perspective: 900 }}>
        {DUMMY_FILMS.map((film, i) => {
          const off = i - active;
          const abs = Math.abs(off);
          const sign = Math.sign(off);
          const transform =
            off === 0
              ? 'translateX(0) translateZ(60px)'
              : `translateX(${sign * (78 + abs * 44)}px) translateZ(-40px) rotateY(${-sign * 55}deg)`;
          return (
            <button
              key={film.id}
              onClick={() => setActive(i)}
              className='absolute left-1/2 top-[10px]'
              style={{
                width: COVER_W,
                height: COVER_H,
                marginLeft: -COVER_W / 2,
                transform,
                transformStyle: 'preserve-3d',
                transition: 'transform .45s cubic-bezier(.2,.7,.3,1)',
                zIndex: 100 - abs,
              }}>
              <span
                className='flex h-full w-full flex-col items-center justify-center gap-2 rounded-[4px] border border-white/60'
                style={{
                  background: film.bg,
                  boxShadow: '0 8px 22px rgba(80,70,150,.35)',
                  // WebKit 전용 반사 — 미지원 브라우저는 반사 없이 동일 동작
                  WebkitBoxReflect:
                    'below 6px linear-gradient(transparent 62%, rgba(0,0,0,.25))',
                }}>
                <span className='font-galmuri14 text-[30px] font-bold text-white/90'>
                  ?
                </span>
                <span className='font-galmuri9 text-[10px] tracking-[2px] text-white/80'>
                  TBD
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 타이틀 + 내비게이션 */}
      <div className='mt-1 flex items-center justify-center gap-4'>
        <FlowArrow dir={-1} active={active} setActive={setActive} />
        <span className='w-[150px] text-center'>
          <span className='font-galmuri11 block text-[12px] font-bold text-[#4a4466]'>
            상영작 #{active + 1}
          </span>
          <span className='font-galmuri9 block text-[10px] text-[#8b80b8]'>
            라인업 공개 예정
          </span>
        </span>
        <FlowArrow dir={1} active={active} setActive={setActive} />
      </div>
    </div>
  );
};

const FlowArrow = ({
  dir,
  active,
  setActive,
}: {
  dir: -1 | 1;
  active: number;
  setActive: (i: number) => void;
}) => (
  <button
    onClick={() => setActive(active + dir)}
    disabled={dir === -1 ? active === 0 : active === DUMMY_FILMS.length - 1}
    className='h-[26px] w-[26px] rounded-full border border-[#d8d2f0] bg-white/80 font-os text-[13px] text-[#7b6fd0] hover:bg-white disabled:opacity-40'>
    {dir === -1 ? '‹' : '›'}
  </button>
);
