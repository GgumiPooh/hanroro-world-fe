import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import BlogIcon from "@/icons/BlogIcon";
import InstagramIcon from "@/icons/Instagram";
import SignIcon from "@/icons/SignIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import { type FC } from "react";

const Home: FC = () => {
  return (
    <div className="relative text-black">
      <ImageWithPlaceholder
        className="h-dvh w-full"
        imgClassName="object-cover object-center"
        src="/images/home-banner5.png"
        alt="home banner"
      />
      <SignIcon className="absolute bottom-15 left-[3%] w-45 text-plum-100 md:w-100" />
      <div className="absolute bottom-5 left-[3%]">
        <h3 className="text-left text-xs font-bold text-plum-300 md:text-sm">
          NOT OFFICIAL SITE
          <br />
          CONTACT : hanroro6055@gmail.com
        </h3>
      </div>
      <div className="absolute right-[5%] bottom-20 flex flex-col gap-5 md:flex-row md:gap-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            window.open("https://www.instagram.com/hanr0r0/?hl=ko", "_blank");
          }}
          aria-label="Instagram 채널로 이동"
        >
          <InstagramIcon className="h-8 md:h-15" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            window.open("https://www.youtube.com/@hanroro6055", "_blank");
          }}
          aria-label="YouTube 채널로 이동"
        >
          <YoutubeIcon className="h-7 md:h-13" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            window.open(
              "https://m.blog.naver.com/PostList.naver?blogId=hanr0r0&tab=1",
              "_blank",
            );
          }}
          aria-label="Blog 채널로 이동"
        >
          <BlogIcon className="h-10 p-2 text-green-600 md:h-15" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
