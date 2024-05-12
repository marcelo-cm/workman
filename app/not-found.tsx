import SideBar from "@/components/dashboard/SideBar";

const NotFound = () => {
  return (
    <div className="flex text-black">
      <SideBar />
      <div>Whoops. Page not found.</div>
    </div>
  );
};

export default NotFound;
