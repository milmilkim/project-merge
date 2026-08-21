import { useState } from 'react';
import type { AuthState } from '@/features/auth';
import { createSuggestion, deleteSuggestion, useSuggestions } from '@/features/suggest';

const btn =
  'border border-ed6-silverBorder bg-ed6-silver px-3 py-1 font-galmuri11 text-[12px] text-ed6-lunaBlue active:translate-y-px disabled:opacity-50';
const field =
  'w-full border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[15px] text-ed6-text';

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : '…';

/** 상영작 추천 — 로그인 유저만 보내는 일방 폼. 보내면 완료 화면. 관리자는 아래에 받은 목록이 붙는다. */
export const SuggestWindow = ({ auth }: { auth: AuthState }) => {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const received = useSuggestions(auth.isAdmin);

  const submit = async () => {
    setBusy(true);
    try {
      await createSuggestion({ title, reason });
      setDone(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : '전송에 실패했습니다.');
      setBusy(false);
    }
  };

  return (
    <div className='w-[min(86vw,320px)] p-4 font-galmuri11 text-[12px] text-ed6-text'>
      <p className='mb-3 font-galmuri14 text-[15px] leading-[24px]'>
        6회에서 보고 싶은 작품을 추천해 주세요. 보내주신 내용은 운영진만 확인합니다.
      </p>
      {!auth.user ? (
        <div className='text-center'>
          <button className={btn} onClick={() => auth.signIn()}>구글 로그인 후 추천하기</button>
        </div>
      ) : done ? (
        <div className='space-y-3 text-center'>
          <p className='font-galmuri14 text-[15px] text-ed6-lunaBlue'>추천해 주셔서 감사합니다. 잘 받았습니다 ✦</p>
          <button
            className={btn}
            onClick={() => {
              setTitle('');
              setReason('');
              setDone(false);
              setBusy(false);
            }}>
            하나 더 추천하기
          </button>
        </div>
      ) : (
        <div className='space-y-2'>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='작품명 (감독/연도 있으면 같이)'
            maxLength={100}
            className={field}
          />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='추천 이유 (선택)'
            rows={5}
            maxLength={1000}
            className={`${field} resize-y leading-[24px]`}
          />
          <div className='flex justify-end'>
            <button onClick={submit} disabled={!title.trim() || busy} className={btn}>
              {busy ? '보내는 중…' : '보내기'}
            </button>
          </div>
        </div>
      )}

      {auth.isAdmin && (
        <div className='mt-4 border-t border-[#c4c0b2] pt-3'>
          <div className='mb-1 font-galmuri11 text-[12px] font-bold text-ed6-lunaBlue'>
            받은 추천 {received.length}건 (관리자)
          </div>
          <ul className='max-h-[36vh] divide-y divide-[#e4e0f0] overflow-y-auto border border-[#c4c0b2] bg-white'>
            {received.length === 0 && (
              <li className='px-2 py-3 text-center text-[#888]'>아직 없습니다</li>
            )}
            {received.map((s) => (
              <li key={s.id} className='px-2 py-[6px]'>
                <div className='flex items-baseline justify-between gap-2'>
                  <span className='min-w-0 truncate font-galmuri14 text-[15px]'>{s.title}</span>
                  <span className='shrink-0 font-galmuri9 text-[10px] text-[#888]'>{fmt(s.createdAt)}</span>
                </div>
                {s.reason && (
                  <p className='mt-[2px] whitespace-pre-wrap leading-[18px] text-[#444]'>{s.reason}</p>
                )}
                <div className='mt-[2px] flex items-center justify-between font-galmuri9 text-[10px] text-[#8b80b8]'>
                  <span>{s.authorName}{s.authorEmail ? ` · ${s.authorEmail}` : ''}</span>
                  <button
                    onClick={() =>
                      window.confirm(`'${s.title}' 추천을 삭제하시겠습니까?`) &&
                      deleteSuggestion(s.id).catch((e) => alert(e.message))
                    }
                    className='text-red-600 hover:underline'>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
