import { Button } from '@/shared/ui';

interface Props {
  onOpen: () => void;
}

export const MenuTrigger = ({ onOpen }: Props) => {
  return (
    <Button
      onClick={onOpen}
      className='fixed top-4 right-4 z-[999] px-2 py-1 normal-case text-sm font-bold shadow-md bg-ed5-point text-white border-white/60'>
      MENU ☰
    </Button>
  );
};
