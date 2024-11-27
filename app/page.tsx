import Features from '@/components/(landing)/(sections)/features';
import Footer from '@/components/(landing)/(sections)/footer';
import Integrations from '@/components/(landing)/(sections)/integrations';
import NavBar from '@/components/(landing)/(sections)/nav';
import Splash from '@/components/(landing)/(sections)/splash';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-wm-orange-50/50">
      <NavBar />
      <Splash />
      <Features />
      <Integrations />
      <Footer />
    </div>
  );
}
