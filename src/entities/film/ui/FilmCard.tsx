import { type Film } from '../model/types';

export const FilmCard = ({ poster, title }: Film) => {
  return (
    <div>
      <div className='mb-3'>
        {poster ? (
          <img
            src={poster}
            className='w-full h-auto rounded'
            alt='포스터'
          />
        ) : (
          <div className='aspect-[2/3] w-full flex items-center justify-center rounded border border-current/30 bg-current/5 text-current/40 text-sm'>
            포스터 준비중
          </div>
        )}
      </div>
      <span className='text-current'>{title}</span>
    </div>
  );
};
