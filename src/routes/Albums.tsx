import AlbumList from "@/components/AlbumList";
import BlurBackground from "@/components/BlurBackground";
import type { FC } from "react";

const Albums: FC = () => {
  return (
    <div className="relative scrollbar-hide h-dvh overflow-y-auto pt-50">
      <BlurBackground overlay overlayClassName="bg-gray-400/50" />
      <h1 className="mb-35 text-center text-5xl font-bold text-[#faf8e1] md:mb-60 md:text-8xl">
        Albums
      </h1>

      <div className="z-2 mx-auto w-[min(92vw,760px)] px-5.5">
        <AlbumList />
      </div>
    </div>
  );
};

export default Albums;
