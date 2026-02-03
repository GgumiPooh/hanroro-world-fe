import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import BlogIcon from "@/icons/BlogIcon";
import InstagramIcon from "@/icons/Instagram";
import SignIcon from "@/icons/SignIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import { type FC } from "react";

const SOCIAL_LINKS = {
  blog: "https://m.blog.naver.com/PostList.naver?blogId=hanr0r0&tab=1",
  instagram: "https://www.instagram.com/hanr0r0/?hl=ko",
  youtube: "https://www.youtube.com/@hanroro6055",
  homepage: "https://www.hanroro.com",
} as const;

const Home: FC = () => {
  return (
    <div className="relative h-dvh text-black">
      <BlurBackground />
      <SignIcon className="absolute bottom-[8%] left-[2%] w-60 text-gray-700 sm:w-100 md:bottom-20 md:left-5 md:w-120" />
      <div className="absolute bottom-[2.5%] left-[3%]">
        <h3 className="text-left text-xs font-bold text-gray-400 md:text-sm">
          NOT OFFICIAL SITE
          <br />
          CONTACT : hyoeun.jin2@gmail.com
        </h3>
      </div>
      <div className="absolute right-[3%] bottom-[2.5%] flex flex-col gap-10 sm:gap-23 md:bottom-15">
        <Button
          variant="icon"
          size="sm"
          onClick={handleOpenBlog}
          aria-label="Blog 채널로 이동"
        >
          <BlogIcon className="h-7 text-[#38bb0c] sm:h-10" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={handleOpenInstagram}
          aria-label="Instagram 채널로 이동"
        >
          <InstagramIcon className="h-10 sm:h-14" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={handleOpenYoutube}
          aria-label="YouTube 채널로 이동"
        >
          <YoutubeIcon className="h-8 sm:h-12" />
        </Button>
        <Button
          variant="icon"
          size="sm"
          onClick={handleOpenHomepage}
          aria-label="hanroro 홈페이지로 이동"
        >
          <img
            src="/images/hanroro.webp"
            alt="hanroro 홈페이지"
            className="h-9 rounded-4xl sm:h-13"
          />
        </Button>
      </div>
    </div>
  );

  function handleOpenBlog() {
    window.open(SOCIAL_LINKS.blog, "_blank");
  }

  function handleOpenInstagram() {
    window.open(SOCIAL_LINKS.instagram, "_blank");
  }

  function handleOpenYoutube() {
    window.open(SOCIAL_LINKS.youtube, "_blank");
  }

  function handleOpenHomepage() {
    window.open(SOCIAL_LINKS.homepage, "_blank");
  }
};

export default Home;
