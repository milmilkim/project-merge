import { useRef } from 'react';
import { useKakaoMap } from '@/shared/lib';

const KAKAO_KEY = '9c1bddd62237e59e77c3ef3b898805fa';

interface Props {
  center: { lat: number; lng: number };
  /** 마커 클릭 시 열 카카오맵 링크 (선택) */
  mapLink?: string;
}

export const EventMap = ({ center, mapLink }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useKakaoMap({
    mapRef,
    appKey: KAKAO_KEY,
    center,
    onMarkerClick: () => {
      if (mapLink) window.open(mapLink);
    },
  });

  return <div ref={mapRef} className='w-full md:w-96 aspect-video mt-3'></div>;
};
