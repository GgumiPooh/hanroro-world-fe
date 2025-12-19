import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { FC } from "react";

const SongDetail: FC = () => {
  return (
    <div className="relative overflow-y-auto pt-50">
      <div className="fixed inset-0 -z-1 bg-gray-400/50" />
      <h1 className="mb-40 text-center text-5xl font-bold text-gray-100 md:mb-60 md:text-8xl">
        Song Detail
      </h1>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName="object-cover object-center blur-lg backdrop-blur"
        src="/images/home-banner5.png"
        alt="home banner"
      />

      <div className="z-2 mx-auto w-[min(92vw,760px)]"></div>
    </div>
  );
};

export default SongDetail;
