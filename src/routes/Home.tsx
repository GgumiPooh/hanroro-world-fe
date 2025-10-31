import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { type FC } from "react";

const Home: FC = () => {
  return (
    <div className="text-black">
      <div className="mx-auto w-fit">
        <ImageWithPlaceholder
          className="aspect-square h-[50dvh] rounded-4xl border-2 border-green-300"
          src="/images/home-banner.png"
          alt="home banner"
        />
      </div>
    </div>
  );
};

export default Home;
