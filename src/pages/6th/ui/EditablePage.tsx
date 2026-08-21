import { useState, type ReactNode } from 'react';
import type { AuthState } from '@/features/auth';
import { savePageContent, usePageContent } from '@/features/pages';
import { RichText } from '@/shared/ui/RichText';

interface Props {
  /** pages/{id} */
  id: string;
  /** 문서 없을 때 보여줄 기본 본문(미니 마크업) */
  fallback: string;
  auth: AuthState;
  /** 본문 아래 고정 꼬리(준비중 스피너 등) */
  footer?: ReactNode;
}

const btn =
  'border border-ed6-silverBorder bg-ed6-silver px-2 py-[2px] font-galmuri11 text-[11px] text-ed6-lunaBlue active:translate-y-px disabled:opacity-50';

/**
 * 관리자가 제자리에서 고치는 안내 페이지. 메모장 셸 안에 본문(RichText) + 관리자면 [편집].
 * 문법: `## 소제목` / `**굵게**` / 빈 줄 문단.
 */
export const EditablePage = ({ id, fallback, auth, footer }: Props) => {
  const content = usePageContent(id, fallback);
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (draft === null) return;
    setBusy(true);
    try {
      await savePageContent(id, draft);
      setDraft(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='w-[min(86vw,320px)]'>
      <div className='flex items-center gap-[14px] border-b border-[#c4c0b2] bg-ed6-silver px-[10px] py-1 font-os text-[11px] text-[#333]'>
        <span>파일</span>
        <span>편집</span>
        <span>서식</span>
        <span>도움말</span>
        {auth.isAdmin && draft === null && (
          <button onClick={() => setDraft(content)} className={`${btn} ml-auto`}>
            편집
          </button>
        )}
      </div>
      <div
        className='m-2 border border-[#9a9a9a] bg-white p-3 font-galmuri14 text-[15px] leading-[24px] text-[#222]'
        style={{ boxShadow: 'inset 1px 1px 0 #cfcabd' }}>
        {draft === null ? (
          <>
            <RichText text={content} headingClassName='font-bold text-ed6-lunaBlue' />
            {footer}
          </>
        ) : (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={12}
              disabled={busy}
              placeholder={'## 소제목\n**굵게**\n빈 줄로 문단 구분'}
              className='w-full resize-y border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[15px] leading-[24px]'
            />
            <div className='mt-2 flex justify-end gap-2'>
              <button onClick={() => setDraft(null)} disabled={busy} className={btn}>취소</button>
              <button onClick={save} disabled={busy} className={btn}>{busy ? '저장 중…' : '저장'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
