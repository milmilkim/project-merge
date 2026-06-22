import { type Film } from '../model/types';

export const FilmCard = ({ poster, title }: Film) => {
  return (
    <div>
      <div className='mb-3'>
        {poster ? (
          <img
            src={poster}
            className='min-h-[300px] placeholder-gray-300'
            alt='포스터'
          />
        ) : (
          <div className='min-h-[300px] w-full flex items-center justify-center rounded border border-current/30 bg-current/5 text-current/40 text-sm'>
            포스터 준비중
          </div>
        )}
      </div>
      <span className='text-current'>{title}</span>
    </div>
  );
};
