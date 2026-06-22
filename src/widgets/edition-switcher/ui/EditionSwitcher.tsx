import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { editions } from '@/shared/config/editions';
import type { EditionEntry } from '@/entities/edition';

/**
 * 회차 스왑 GNB. 회차 디자인과 무관하게 공통으로 마운트된다.
 * 색은 현재 회차 셸의 text 색(text-current)을 따른다.
 */
export const EditionSwitcher = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const segments = pathname.split('/').filter(Boolean); // ['5th', 'film']
  const currentSlug = segments[0];
  const subpath = segments.slice(1).join('/');
  const current = editions.find((e) => e.slug === currentSlug);

  const go = (edition: EditionEntry) => {
    setOpen(false);
    // coming-soon 회차는 하위 페이지가 없으므로 회차 홈으로
    if (edition.status === 'coming-soon' || !subpath) {
      navigate(`/${edition.slug}`);
    } else {
      navigate(`/${edition.slug}/${subpath}`);
    }
  };

  return (
    <div className='fixed top-4 left-4 z-[1000] text-current'>
      <button
        onClick={() => setOpen((o) => !o)}
        className='px-3 py-1 rounded-full border border-current/40 bg-current/10 backdrop-blur-sm text-sm font-bold'>
        {current ? `${current.no}회` : '회차'} ▾
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}
            className='rounded-xl border border-current/30 bg-current/10 backdrop-blur-md overflow-hidden min-w-[120px]'>
            {editions.map((edition) => {
              const isCurrent = edition.slug === currentSlug;
              return (
                <li key={edition.slug}>
                  <button
                    onClick={() => go(edition)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-current/15 ${
                      isCurrent ? 'font-bold' : 'opacity-80'
                    }`}>
                    {edition.no}회
                    {edition.status === 'coming-soon' && ' (예정)'}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
