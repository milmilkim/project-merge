import { useState } from 'react';
import type { AuthState } from '@/features/auth';

interface Props {
  auth: AuthState;
  /** 방금 가입한 유저 — 환영 문구 + 닉네임부터 받는다 */
  isNew?: boolean;
  onClose: () => void;
}

const btn =
  'border border-ed6-silverBorder bg-ed6-silver px-3 py-1 font-galmuri11 text-[12px] text-ed6-lunaBlue active:translate-y-px disabled:opacity-50';

/** 시작메뉴 사용자 → 사용자 계정 창. 닉네임 수정 + 탈퇴(관리자 제외). */
export const ProfileWindow = ({ auth, isNew, onClose }: Props) => {
  const u = auth.user;
  const [name, setName] = useState(u?.displayName ?? '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!u) {
    return (
      <div className='w-[min(86vw,300px)] p-4 text-center'>
        <p className='mb-3 font-galmuri14 text-[15px] text-ed6-text'>로그인이 필요합니다.</p>
        <button className={btn} onClick={() => auth.signIn()}>구글 로그인</button>
      </div>
    );
  }

  const save = async () => {
    const next = name.trim();
    if (!next) return setMsg('닉네임을 입력해 주세요.');
    setBusy(true);
    try {
      await auth.updateNickname(next);
      setMsg('저장되었습니다.');
      if (isNew) onClose();
    } catch (e) {
      setMsg(`저장 실패: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 계정은 삭제되며 작성한 글은 남습니다.')) return;
    setBusy(true);
    try {
      await auth.deleteAccount();
      onClose();
    } catch (e) {
      setMsg(`탈퇴 실패: ${(e as Error).message}`);
      setBusy(false);
    }
  };

  return (
    <div className='w-[min(86vw,320px)] p-4 font-galmuri11 text-[12px] text-ed6-text'>
      {isNew && (
        <p className='mb-3 font-galmuri14 text-[15px] text-ed6-lunaBlue'>
          환영합니다! 게시판에서 사용할 닉네임을 정해 주세요.
        </p>
      )}
      <div className='mb-3 flex items-center gap-3'>
        {u.photoURL ? (
          <img
            src={u.photoURL}
            alt=''
            referrerPolicy='no-referrer'
            className='h-12 w-12 rounded-[4px] border border-[#9a9a9a]'
          />
        ) : (
          <span className='h-12 w-12 rounded-[4px] border border-[#9a9a9a] bg-[#c3bcf4]' />
        )}
        <div className='min-w-0'>
          <div className='truncate font-galmuri14 text-[15px]'>
            {u.displayName ?? '사용자'}
            {auth.isAdmin && <b className='ml-1 text-ed6-lunaBlue'>[관리자]</b>}
          </div>
          <div className='truncate text-[#666]'>{u.email}</div>
        </div>
      </div>

      <label className='block'>
        닉네임
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          maxLength={20}
          disabled={busy}
          className='mt-1 w-full border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[15px]'
          style={{ boxShadow: 'inset 1px 1px 0 #cfcabd' }}
        />
      </label>

      <div className='mt-3 flex items-center justify-between'>
        {!auth.isAdmin ? (
          <button onClick={remove} disabled={busy} className={`${btn} text-red-700`}>
            탈퇴
          </button>
        ) : (
          <span />
        )}
        <div className='flex gap-2'>
          <button onClick={() => auth.signOut().then(onClose)} disabled={busy} className={btn}>
            로그아웃
          </button>
          <button onClick={save} disabled={busy} className={btn}>
            저장
          </button>
        </div>
      </div>
      {msg && <p className='mt-2 text-[#666]'>{msg}</p>}
    </div>
  );
};
