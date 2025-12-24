import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
