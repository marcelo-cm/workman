import BookDemo from './book-demo-button';
import EmailFounders from './email-founders-button';

export const CallToAction = () => {
  return (
    <div className="flex flex-row gap-4">
      <BookDemo />
      <EmailFounders />
    </div>
  );
};
