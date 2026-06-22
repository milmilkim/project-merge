import TextSection from '@/shared/ui/TextSection';

export const About = () => {
  return (
    <div className='px-3 py-10 w-full md:max-w-4xl m-auto text-ed5-text'>
      <TextSection title='머지영화제란?'>
        <p>
          <span className='point'>머지영화제</span>는 2018년부터 '릴리스의
          신도들'이 주최하여 다양한 장르와 형식의 독창적이고 재미있는 드라마,
          애니메이션, 영화를 한데 모아 선보이는 자체 영화제입니다. 매 회 새로운
          테마와 디자인으로 관객을 찾아옵니다.
        </p>
      </TextSection>

      <TextSection title='이상한 영화 몰아보기'>
        <p>
          제5회 머지영화제의 테마는{' '}
          <span className='point'>"이상한 영화 몰아보기"</span>입니다. 쉽게
          받아들이기 어렵지만 오래 마음에 남는, 경계를 넘나드는 작품들을 한자리에
          모았습니다. 불편함마저 하나의 경험으로 'MERGE'해보세요.
        </p>
      </TextSection>

      <TextSection title='연혁'>
        <ul className='mb-3'>
          <li>- 2018.12.26: 머지영화제</li>
          <li>- 2019.06.27: 2회 머지영화제: Angel Attack-사도의 습격-2019</li>
          <li>- 2020.12.20: 3회 머지영화제</li>
          <li>- 2023.09.28: 4회 머지영화제: REBIRTH N REVERSE</li>
          <li>- 5회 머지영화제: 이상한 영화 몰아보기</li>
        </ul>
      </TextSection>
    </div>
  );
};
