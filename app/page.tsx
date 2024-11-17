import Benefits from '@/components/(landing)/(sections)/benefits';
import Features from '@/components/(landing)/(sections)/features';
import Footer from '@/components/(landing)/(sections)/footer';
import NavBar from '@/components/(landing)/(sections)/nav';
import Splash from '@/components/(landing)/(sections)/splash';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <NavBar />
      <Splash />
      <Features />
      <Benefits />
      <Footer />
    </div>
  );
}
