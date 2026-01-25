import TextSection from '@/shared/ui/TextSection';
import { useCallback, useEffect, useRef } from 'react';
import Seat from '@/shared/assets/images/jari.jpg';
import { Link } from 'react-router-dom';
import Poster from '@/shared/assets/images/poster.jpg';

// 공개키
const KAKAO_KEY = '9c1bddd62237e59e77c3ef3b898805fa';
const locationLatLng = { lat: 37.5569115255206, lng: 126.867878866131 };

export const EventPage = () => {
  const initMap = useCallback(() => {
    if (!kakao) return;

    console.log(kakao);
    const container = mapRef.current;

    if (!container) return;

    kakao.maps.load(() => {
      const target = new kakao.maps.LatLng(locationLatLng.lat, locationLatLng.lng);
      const options = {
        //지도를 생성할 때 필요한 기본 옵션
        center: target,
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      // 지도에 마커를 생성하고 표시한다
      const marker = new kakao.maps.Marker({
        position: target, // 마커의 좌표
        map: map, // 마커를 표시할 지도 객체
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        window.open('	https://map.kakao.com/link/map/472996223');
      });
    });
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    script.async = true;

    document.head.appendChild(script);
    script.onload = initMap;

    return () => {
      document.head.removeChild(script);
    };
  }, [initMap]);

  const mapRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className='px-0 md:px-10 py-10 md:max-w-4xl m-auto'>
      <TextSection title='REBIRTH N REVERSE'>
        <img className='w-full md:w-3/5 my-5' src={Poster} alt='제 4회 머지영화제 포스터' />
        <p>
          제 4회 머지영화제 <span className='point'>REBIRTH N REVERSE</span>는
          3년 만에 재개되는 행사로, 말 그대로 '재탄생'과 '반전'을 주제로 합니다.
          다양한 장르와 스타일의 작품들이 병합되는 순간을 체험해보세요. 새롭게
          시작하는 머지 영화제의 무한한 가능성을 함께 만나보시길 바랍니다.
        </p>
      </TextSection>

      <TextSection title='행사 정보'>
        <ul>
          <li>
            - 시작: 2023년 9월 28일 15:00 (KST) ~ 2023년 9월 29일 (종료시간
            미정)
          </li>
          <li>
            - 입장료: <span className='point'>25000원</span> (식비 별도)
          </li>
          <li>- 장소: JK 블라썸 호텔 (서울특별시 강서구 양천로 65길 41-22)</li>
          <li>
            - 티켓 예매: 머지컴퍼니{' '}
            <Link to='/ticket' className='link'>
              티켓 예매 페이지
            </Link>
          </li>
        </ul>

        <div ref={mapRef} className='w-full md:w-96 aspect-video mt-3'></div>
      </TextSection>

      <TextSection title='좌석 배치도'>
        <img src={Seat} className=' w-36 mb-3' alt='좌석배치도' />
        <p>전석 동일 25000원</p>
      </TextSection>
    </div>
  );
};

export default Event;
