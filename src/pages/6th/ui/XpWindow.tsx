import { motion, useDragControls } from 'framer-motion';
import type { ReactNode } from 'react';
import { TITLEBAR, ACCENT } from './styles';

interface Props {
  title: string;
  children: ReactNode;
  onMinimize?: () => void;
  onClose?: () => void;
  dragConstraints?: React.RefObject<Element>;
  draggable?: boolean;
  className?: string;
}

/**
 * XP 스타일 창. 루나 블루 그라데이션 타이틀바 + 액센트 아이콘 + 최소/최대/닫기.
 * 타이틀바를 핸들로 드래그(useDragControls). (시안 윈도우 해부도 그대로)
 */
export const XpWindow = ({
  title,
  children,
  onMinimize,
  onClose,
  dragConstraints,
  draggable = true,
  className = '',
}: Props) => {
  const controls = useDragControls();

  return (
    <motion.div
      drag={draggable}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0.04}
      dragConstraints={dragConstraints}
      className={`pointer-events-auto select-none ${className}`}
      style={{ boxShadow: '0 16px 40px rgba(0,0,0,.5)' }}>
      {/* 타이틀바 = 드래그 핸들 */}
      <div
        onPointerDown={(e) => draggable && controls.start(e)}
        className={`flex h-8 items-center gap-[7px] rounded-t-[9px] pl-2 pr-[5px] ${
          draggable ? 'cursor-move touch-none' : ''
        }`}
        style={{ background: TITLEBAR }}>
        <span
          className='h-[18px] w-[18px] rounded-[3px]'
          style={{
            background: `linear-gradient(160deg,${ACCENT},#0b88d6)`,
            boxShadow: `0 0 6px ${ACCENT}`,
          }}
        />
        <span
          className='flex-1 truncate font-os text-[13.5px] font-bold text-white'
          style={{ textShadow: '1px 1px 2px rgba(0,0,30,.55)' }}>
          {title}
        </span>
        <div className='flex gap-[3px]'>
          <WinButton kind='min' onClick={onMinimize} />
          <WinButton kind='max' />
          <WinButton kind='close' onClick={onClose} />
        </div>
      </div>

      {/* 본문 */}
      <div
        className='rounded-b-[8px] border border-t-0 border-ed6-silverBorder bg-ed6-silver'
        style={{ boxShadow: 'inset 1px 1px 0 #fff' }}>
        {children}
      </div>
    </motion.div>
  );
};

interface WinButtonProps {
  kind: 'min' | 'max' | 'close';
  onClick?: () => void;
}

const WinButton = ({ kind, onClick }: WinButtonProps) => {
  const isClose = kind === 'close';
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className='flex h-5 w-[21px] items-center justify-center rounded-[3px] border border-white transition active:translate-y-px disabled:opacity-70'
      style={{
        background: isClose
          ? 'linear-gradient(180deg,#f59b7f,#d63a13)'
          : 'linear-gradient(180deg,#5ea0f5,#0e57df)',
      }}>
      {kind === 'min' && <span className='mb-[3px] h-[3px] w-[9px] bg-white' />}
      {kind === 'max' && (
        <span
          className='h-2 w-[9px] border-[1.5px] border-white'
          style={{ borderTopWidth: 3 }}
        />
      )}
      {isClose && (
        <span className='font-os text-[13px] font-bold leading-none text-white'>
          ×
        </span>
      )}
    </button>
  );
};
