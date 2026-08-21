import type { ReactNode } from 'react';

/** `**굵게**` 인라인 → <b> */
const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
    seg.startsWith('**') && seg.endsWith('**') ? (
      <b key={i}>{seg.slice(2, -2)}</b>
    ) : (
      seg
    ),
  );

interface Props {
  text: string;
  /** 소제목(`## `) 스타일 클래스 */
  headingClassName?: string;
  className?: string;
}

/**
 * 게시글·안내 페이지 공용 미니 마크업. 지원 문법 3종뿐:
 *   `## 소제목` / `**굵게**` / 빈 줄 = 문단 나눔. 나머지 줄바꿈은 그대로.
 * ponytail: 링크·목록·이미지 필요해지면 그때 마크다운 라이브러리로 교체
 */
export const RichText = ({ text, headingClassName = 'font-bold', className }: Props) => (
  <div className={className}>
    {text
      .trim()
      .split(/\n{2,}/)
      .map((para, pi) => (
        <p key={pi} className='whitespace-pre-wrap [&+p]:mt-[1em]'>
          {para.split('\n').map((line, li, arr) => {
            const isHeading = line.startsWith('## ');
            const node = isHeading ? (
              <span className={headingClassName}>{inline(line.slice(3))}</span>
            ) : (
              inline(line)
            );
            return (
              <span key={li}>
                {node}
                {li < arr.length - 1 && '\n'}
              </span>
            );
          })}
        </p>
      ))}
  </div>
);
