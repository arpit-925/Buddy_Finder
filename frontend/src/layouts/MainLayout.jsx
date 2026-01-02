import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
   return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
