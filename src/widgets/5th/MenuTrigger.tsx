import { useSetAtom } from 'jotai';
import { isOpenAtom } from '@/shared/model/menu';
import { Button } from '@/shared/ui';

export const MenuTrigger = () => {
  const setIsOpen = useSetAtom(isOpenAtom);

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className='fixed top-4 right-4 z-[999] px-2 py-1 normal-case text-sm font-bold shadow-md bg-ed5-point text-white border-white/60'>
      MENU ☰
    </Button>
  );
};
