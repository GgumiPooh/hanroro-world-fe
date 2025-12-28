import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import BlogIcon from "@/icons/BlogIcon";
import InstagramIcon from "@/icons/Instagram";
import SignIcon from "@/icons/SignIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import { type FC } from "react";

const Home: FC = () => {
  return (
    <div className="relative h-dvh text-black">
      <BlurBackground />
      <SignIcon className="absolute bottom-15 left-[2%] w-60 text-gray-700 sm:w-100 md:bottom-20 md:left-5 md:w-120" />
      <div className="absolute bottom-5 left-[3%]">
        <h3 className="text-left text-xs font-bold text-gray-400 md:text-sm">
          NOT OFFICIAL SITE
          <br />
          CONTACT : hyoeun.jin2@gmail.com
        </h3>
      </div>
      <div className="absolute right-[5%] bottom-5 flex flex-col gap-10 sm:gap-23 md:bottom-15">
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open(
              "https://m.blog.naver.com/PostList.naver?blogId=hanr0r0&tab=1",
              "_blank",
            );
          }}
          aria-label="Blog 채널로 이동"
        >
          <BlogIcon className="h-7 text-[#38bb0c] sm:h-10" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open("https://www.instagram.com/hanr0r0/?hl=ko", "_blank");
          }}
          aria-label="Instagram 채널로 이동"
        >
          <InstagramIcon className="h-11 sm:h-15" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open("https://www.youtube.com/@hanroro6055", "_blank");
          }}
          aria-label="YouTube 채널로 이동"
        >
          <YoutubeIcon className="h-8 sm:h-13" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open("https://www.hanroro.com", "_blank");
          }}
          aria-label="hanroro 홈페이지로 이동"
        >
          <img
            src="/images/hanroro-logo-black.png"
            alt="hanroro 홈페이지"
            className="h-6 sm:h-9"
          />
        </Button>
      </div>
    </div>
  );
};

export default Home;
