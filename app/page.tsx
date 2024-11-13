import NavBar from '@/components/(landing)/(sections)/nav';
import Splash from '@/components/(landing)/(sections)/splash';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <NavBar />
      <Splash />
    </div>
  );
}
