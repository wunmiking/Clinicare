import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contextStore";
import { Outlet } from "react-router";

export default function DashboardLayout() {

  const {user} = useAuth(); 

  return (
    <div className="min-h[100dvh] flex  bg-slate-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      

      <div className="ml-[200px] flex-1">
       <div className="hidden lg:block">
        <Navbar user={user} />
       </div>
        <div className="lg:hidden">
          <MobileNav user={user} />
          </div>        
      

       <main className="p-4">
          <Outlet />
        </main>
        </div>
    </div>
  );
}
