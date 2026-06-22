import { SKY, HILL, HILL_CLIP, DITHER } from './styles';

/**
 * 픽셀 도트 'Bliss' 초원 배경.
 * 포스터라이즈드 하늘 + 계단형 초록 언덕 + 저해상 디더 그리드. (시안 그대로)
 */
export const BlissBackground = () => {
  return (
    <div className='absolute inset-0 z-0 overflow-hidden'>
      {/* 하늘 */}
      <div className='absolute inset-0' style={{ background: SKY }} />

      {/* 포스터라이즈드 구름 */}
      <div
        className='absolute'
        style={{
          top: '6%',
          left: '12%',
          width: 150,
          height: 34,
          background: 'rgba(255,255,255,.85)',
          borderRadius: 18,
          boxShadow:
            '60px 14px 0 -6px rgba(255,255,255,.7), -40px 16px 0 -10px rgba(255,255,255,.6)',
        }}
      />
      <div
        className='absolute'
        style={{
          top: '13%',
          right: '16%',
          width: 120,
          height: 28,
          background: 'rgba(255,255,255,.75)',
          borderRadius: 16,
          boxShadow: '-50px 12px 0 -8px rgba(255,255,255,.6)',
        }}
      />

      {/* 계단형 언덕 */}
      <div
        className='absolute inset-0'
        style={{ background: HILL, clipPath: HILL_CLIP }}
      />

      {/* 디더 그리드 */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{ backgroundImage: DITHER }}
      />
    </div>
  );
};
