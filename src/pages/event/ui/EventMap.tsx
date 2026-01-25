import { useRef } from 'react';
import { useKakaoMap } from '@/shared/lib';

const KAKAO_KEY = '9c1bddd62237e59e77c3ef3b898805fa';
const locationLatLng = { lat: 37.5569115255206, lng: 126.867878866131 };

export const EventMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useKakaoMap({
    mapRef,
    appKey: KAKAO_KEY,
    center: locationLatLng,
    onMarkerClick: () => {
      window.open('https://map.kakao.com/link/map/472996223');
    },
  });

  return <div ref={mapRef} className='w-full md:w-96 aspect-video mt-3'></div>;
};
