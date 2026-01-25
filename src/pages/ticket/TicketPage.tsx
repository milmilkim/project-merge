import { BuyTicketButton } from '@/features/buy-ticket';
import { TicketCard } from './ui';

export const TicketPage = () => {
  return (
    <div className='px-3 md:px-10 py-10 w-full md:max-w-4xl m-auto'>
      <div className='flex justify-center'>
        <TicketCard />
      </div>
      <div className='w-full text-center mt-3 text-point  font-bold'>
        ORIGINAL TICKET <br />
        ￦25,000
      </div>

      <div className='w-full space-y-3 mt-10'>
        <BuyTicketButton />
        <div className='text-red-700 font-bold text-xl w-full text-center'>
          SOLD OUT!
        </div>
      </div>
    </div>
  );
};
