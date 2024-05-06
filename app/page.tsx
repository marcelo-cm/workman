import SideBar from "@/components/dashboard/SideBar";

export default function Home() {
  return (
    <main className="flex items-center h-dvh">
      <SideBar />
      <div>Main</div>
    </main>
  );
}
