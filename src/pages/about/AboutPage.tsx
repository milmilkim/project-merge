import TextSection from '@/shared/ui/TextSection';
import Poster from '@/shared/assets/images/eva-poster.jpeg';
export const AboutPage = () => {
  return (
    <div className='px-3 py-10 w-full md:max-w-4xl m-auto'>
      <TextSection title='머지영화제란?'>
        <p>
          <span className='point'>머지영화제</span>는 2018년부터 '릴리스의
          신도들'이 주최하여 다양한 장르와 형식의 독창적이고 재미있는 드라마,
          애니메이션, 영화를 한데 모아 선보이는 행사입니다. 코로나, 졸업,
          취업으로 한동안 개최되지 못했지만 이를 극복한 제 4회 머지 영화제는 3년
          만에 더욱 세련되고 풍성한 내용으로 여러분을 찾아옵니다.
        </p>
      </TextSection>

      <TextSection title='MERGE!'>
        <p>
          머지 영화제는 <span className='point'>MERGE</span>라는 이름 그대로
          '병합'이란 뜻을 내포하고 있습니다. 다양한 장르, 형식, 취향을
          'MERGE'하여 하나의 큰 흐름 속에서 다양성을 축하하는 영화제입니다.{' '}
          <span className='point'>"취향을 MERGE"</span>하라는 슬로건은
          관객들에게 서로 다른 영화들과 문화들을 하나로 병합하여 새로운 경험과
          감동을 느껴보길 초대하는 메시지를 담고 있습니다.
        </p>
      </TextSection>

      <TextSection title='릴리스의 신도들'>
        <p>
          <span className='point'>릴리스(Lilith)</span>는 유대 신화에 등장하는
          아담의 첫 번째 부인으로 전해지며, 여성의 독립성과 자유를 상징하는
          인물입니다. 릴리스의 신도들은 릴리스의 정신을 기리며, 그가 지니고 있던
          독립적인 정신과 가치를 전달하고자 합니다.
        </p>
      </TextSection>

      <TextSection title='연혁'>
        <div className='flex items-end mb-2 w-full'>
          <img
            className=' w-1/2 aspect-auto'
            src={Poster}
            alt='머지영화 2회 포스터'
          />
          <img
            src='https://modo-phinf.pstatic.net/20190529_4/1559061613147hLuqP_JPEG/mosaP9wtgF.jpeg'
            className='w-1/2'
            alt='머지영화 2회 티저
		 포스터'
          />
        </div>
        <ul className='mb-3'>
          <li>- 2018.12.26: 머지영화제</li>
          <li>- 2019.06.27: 2회 머지영화제: Angel Attack-사도의 습격-2019</li>
          <li>- 2020.12.20: 3회 머지영화제</li>
          <li>- 2023.09.28: 4회 머지영화제: REBIRTH N REVERSE</li>
        </ul>
        <p>
          이전 행사의 자세한 정보는{' '}
          <a className='link' href='https://5duck.modoo.at/'>
            공식 홈페이지
          </a>
          에서 확인하세요.
        </p>
      </TextSection>
    </div>
  );
};

