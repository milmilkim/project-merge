import { TextSection } from '@/shared/ui';
import { FilmSwiper } from '@/widgets';
import { films5 } from '@/entities/film';

export const Film = () => {
  return (
    <div className='px-3 md:px-10 py-10 md:max-w-4xl m-auto text-ed5-text'>
      <TextSection title='상영작'>
        <FilmSwiper films={films5} />
      </TextSection>
    </div>
  );
};
