import TextSection from '@/shared/ui/TextSection';
import { EventMap } from '@/widgets';

const VENUE = {
  name: '인터시티서울호텔',
  address: '서울특별시 강서구 마곡동 797-11',
};

export const Event = () => {
  return (
    <div className='px-0 md:px-10 py-10 md:max-w-4xl m-auto text-ed5-text'>
      <TextSection title='이상한 영화 몰아보기'>
        <p>
          제5회 머지영화제{' '}
          <span className='point'>이상한 영화 몰아보기</span>는 쉽게 받아들이기
          어렵지만 강렬한 인상을 남기는 작품들을 모아 함께 보는 자리입니다.
          경계선의 트롤부터 멀티버스의 가족까지, 올해의 라인업을 함께 즐겨보세요.
        </p>
      </TextSection>

      <TextSection title='행사 정보'>
        <ul>
          <li>- 일정: 추후 공개</li>
          <li>- 입장료: 추후 공개</li>
          <li>
            - 장소: {VENUE.name} ({VENUE.address})
          </li>
        </ul>

        {/* TODO: 마곡동 797-11 정확한 좌표로 보정 필요(현재 근사값) */}
        <EventMap center={{ lat: 37.5605, lng: 126.826 }} />
      </TextSection>
    </div>
  );
};
