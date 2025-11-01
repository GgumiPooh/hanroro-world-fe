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
      <SignIcon className="absolute bottom-10 left-1/30 w-120 text-plum-100" />
      <h3 className="absolute top-35 left-9/11 text-left text-sm font-bold text-plum-300">
        NOT OFFICIAL SITE
        <br />
        CONTACT : hanroro6055@gmail.com
      </h3>
      <div className="absolute bottom-20 left-3/4 flex gap-15">
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            window.open("https://www.youtube.com/@hanroro6055", "_blank");
          }}
          aria-label="YouTube 채널로 이동"
        >
          <YoutubeIcon className="h-13 w-15" />
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            window.open("https://www.instagram.com/hanr0r0/?hl=ko", "_blank");
          }}
          aria-label="Instagram 채널로 이동"
        >
          <InstagramIcon className="h-15 w-15" />
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            window.open(
              "https://m.blog.naver.com/PostList.naver?blogId=hanr0r0&tab=1",
              "_blank",
            );
          }}
          aria-label="Blog 채널로 이동"
        >
          <BlogIcon className="h-15 p-2 text-green-500" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
