import TextSection from '@/shared/ui/TextSection';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import { Autoplay, Navigation } from 'swiper/modules';

import Schedule from '@/shared/assets/images/time.png';

import films from '@/pages/film/model/films';

const Item = ({ poster, title }: { poster: string; title: string }) => {
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

export const FilmPage = () => {
  return (
    <div className='px-3 md:px-10 py-10 md:max-w-4xl m-auto'>
      <TextSection title='상영작'>
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={true}
          spaceBetween={20}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          slidesPerView={screen.orientation.type.includes('portrait') ? 1 : 3}>
          {films.map((film, index) => (
            <SwiperSlide className='w-full md:w-1/2 lg:w-1/3' key={index}>
              <Item title={film.title} poster={film.poster} />
            </SwiperSlide>
          ))}
        </Swiper>
      </TextSection>

      <TextSection title='상영 시간표'>
        <img src={Schedule} alt='시간표' />
      </TextSection>
    </div>
  );
};
