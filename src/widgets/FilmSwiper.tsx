import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { FilmCard, films } from '@/entities/film';

export const FilmSwiper = () => {
  return (
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
          <FilmCard {...film}  />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
