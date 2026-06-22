import { TextSection } from '@/shared/ui';
import { FilmSwiper } from '@/widgets';
import { films4 } from '@/entities/film';
import Schedule from '@/shared/assets/images/time.png';

export const Film = () => {
  return (
    <div className='px-3 md:px-10 py-10 md:max-w-4xl m-auto'>
      <TextSection title='상영작'>
        <FilmSwiper films={films4} />
      </TextSection>

      <TextSection title='상영 시간표'>
        <img src={Schedule} alt='시간표' />
      </TextSection>
    </div>
  );
};
