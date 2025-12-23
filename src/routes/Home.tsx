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
      <BlurBackground blur={false} />
      <SignIcon className="absolute bottom-13 left-[1%] w-60 text-gray-800 md:w-100 lg:w-120" />
      <div className="absolute bottom-5 left-[3%]">
        <h3 className="text-left text-xs font-bold text-gray-400 md:text-sm">
          NOT OFFICIAL SITE
          <br />
          CONTACT : hyoeun.jin2@gmail.com
        </h3>
      </div>
      <div className="absolute right-[5%] bottom-20 flex flex-col gap-15 md:gap-25 lg:flex-row">
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
          <BlogIcon className="h-12 p-2 text-[#2DB400] md:h-15" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open("https://www.youtube.com/@hanroro6055", "_blank");
          }}
          aria-label="YouTube 채널로 이동"
        >
          <YoutubeIcon className="h-8 md:h-13" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={() => {
            window.open("https://www.instagram.com/hanr0r0/?hl=ko", "_blank");
          }}
          aria-label="Instagram 채널로 이동"
        >
          <InstagramIcon className="h-12 md:h-15" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
