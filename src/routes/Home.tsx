import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { type FC } from "react";

const Home: FC = () => {
  return (
    <div className="text-black">
      <ImageWithPlaceholder
        className="mx-auto aspect-square h-[50dvh]"
        src="/images/home-banner.png"
        alt="home banner"
      />
    </div>
  );
};

export default Home;
