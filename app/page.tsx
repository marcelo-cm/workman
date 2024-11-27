import Benefits from '@/components/(landing)/(sections)/benefits';
import Features from '@/components/(landing)/(sections)/features';
import Footer from '@/components/(landing)/(sections)/footer';
import NavBar from '@/components/(landing)/(sections)/nav';
import Splash from '@/components/(landing)/(sections)/splash';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white bg-gradient-to-b from-wm-orange-50/50 to-wm-orange-100/50">
      <NavBar />
      <Splash />
      <Features />
      <Benefits />
      <Footer />
    </div>
  );
}
