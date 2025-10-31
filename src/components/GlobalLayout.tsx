import Header from "@/components/Header";
import InstagramIcon from "@/icons/Instagram";
import SignIcon from "@/icons/SignIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import { type FC } from "react";
import { Outlet } from "react-router";

const GlobalLayout: FC = () => {
  return (
    <div>
      <Header className="fixed inset-x-0 top-0 z-1 mx-2 mt-5" />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default GlobalLayout;
