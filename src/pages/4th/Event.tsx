import TextSection from '@/shared/ui/TextSection';
import Seat from '@/shared/assets/images/jari.jpg';
import { Link } from 'react-router-dom';
import Poster from '@/shared/assets/images/poster.jpg';
import { EventMap } from '@/widgets';

export const Event = () => {
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

        <EventMap
          center={{ lat: 37.5569115255206, lng: 126.867878866131 }}
          mapLink='https://map.kakao.com/link/map/472996223'
        />
      </TextSection>

      <TextSection title='좌석 배치도'>
        <img src={Seat} className=' w-36 mb-3' alt='좌석배치도' />
        <p>전석 동일 25000원</p>
      </TextSection>
    </div>
  );
};

