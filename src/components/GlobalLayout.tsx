import Header from "@/components/Header";
import { type FC, type PropsWithChildren } from "react";
import { Outlet } from "react-router";

const GlobalLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header className="fixed inset-x-0 top-0" />
      <Outlet />
    </div>
  );
};

export default GlobalLayout;
