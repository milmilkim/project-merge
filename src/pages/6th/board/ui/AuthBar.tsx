import type { AuthState } from '@/features/auth';

/** 상단 우측 로그인 상태 표시. Y2K 버튼 톤. */
export const AuthBar = ({ auth }: { auth: AuthState }) => {
  if (auth.loading) {
    return <div className='text-right font-galmuri11 text-[12px] text-[#666]'>연결 중…</div>;
  }
  return (
    <div className='flex items-center justify-end gap-2 font-galmuri11 text-[12px]'>
      {auth.user ? (
        <>
          <span className='text-ed6-text'>
            {auth.user.displayName ?? '사용자'}
            {auth.isAdmin && <b className='ml-1 text-ed6-lunaBlue'>[관리자]</b>}
          </span>
          <button onClick={() => auth.signOut()} className={btn}>로그아웃</button>
        </>
      ) : (
        <button onClick={() => auth.signIn()} className={btn}>구글 로그인</button>
      )}
    </div>
  );
};

const btn =
  'border border-ed6-silverBorder bg-ed6-silver px-2 py-[3px] text-ed6-lunaBlue active:translate-y-px';
