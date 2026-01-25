import { PropsWithChildren } from 'react';

interface Props {
  title: string;
}

const TextSection: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <div className='px-10 mb-10'>
      <h2 className='font-pyeongchang font-bold text-2xl text-point mb-1'>
        {title}
      </h2>
      {children}
    </div>
  );
};

export default TextSection;
