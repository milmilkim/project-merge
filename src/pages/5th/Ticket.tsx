import { TextSection } from '@/shared/ui';

export const Ticket = () => {
  return (
    <div className='px-3 md:px-10 py-10 w-full md:max-w-4xl m-auto text-ed5-text'>
      <TextSection title='티켓'>
        <p>
          제5회 머지영화제 티켓 정보는 <span className='point'>추후 공개</span>
          됩니다. 조금만 기다려주세요!
        </p>
      </TextSection>
    </div>
  );
};
