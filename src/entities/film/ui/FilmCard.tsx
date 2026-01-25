import { type Film } from '../model/types';

export const FilmCard = ({ poster, title }: Film) => {
  return (
    <div>
      <div className='mb-3'>
        <img
          src={poster}
          className='min-h-[300px] placeholder-gray-300'
          alt='포스터'
        />
      </div>
      <span className=' text-primary'>{title}</span>
    </div>
  );
};
