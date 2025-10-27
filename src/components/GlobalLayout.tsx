import Header from "@/components/Header";
import { type FC } from "react";
import { Outlet } from "react-router";

const GlobalLayout: FC = () => {
  return (
    <div>
      <Header className="fixed inset-x-0 top-0" />
      <Outlet />
    </div>
  );
};

export default GlobalLayout;
